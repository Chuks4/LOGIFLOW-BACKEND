const userRepository = require("../repositories/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const refreshTokenRepo = require("../repositories/refreshToken");
const db = require("../models");
const roleRepository = require("../repositories/role");
const {
  enqueWelcomeEmail,
  enquePasswordResetEmail,
  enqueEmailVerificationEmail,
} = require("../queues/email");
const tokensRepository = require("../repositories/tokens");

const {
  isEmailValid,
  signAccessToken,
  createJti,
  signRefreshToken,
  createRefreshToken,
  setRefreshCookie,
  hashToken,
  rotateRefreshToken,
  isUserAtLeastEighteen,
} = require("../utils/util");
const welcomeMail = require("../utils/emailTemplates/welcomeMail");
const passwordResetMail = require("../utils/emailTemplates/passwordResetMail");
const emailVerificationMail = require("../utils/emailTemplates/emailVerificationMail");

/**
 * Login user
 * @param {String} email
 * @param {String} password
 * @param {String} options
 * @returns {String} accessToken
 */
const login = async (email, password, options = {}) => {
  if (!isEmailValid(email)) {
    const error = new Error("Invalid Email Address");
    error.status = 401;
    throw error;
  }

  const emailLower = email.trim().toLowerCase();
  const { req, res } = options;
  const user = await userRepository.findByEmail(emailLower);
  if (!user) {
    const error = new Error("Invalid Credentials");
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error("Invalid Credentials");
    error.status = 401;
    throw error;
  }

  const payload = {
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
    roleId: user.role?.id,
    userType: user.role?.name,
    status: user.status,
  };

  if (user.status === "suspended") {
    const error = new Error(
      "Your account has been suspended, Please contact support",
    );
    error.status = 401;
    throw error;
  }

  const accessToken = signAccessToken(payload);
  const jti = createJti();
  const refreshToken = signRefreshToken(payload, jti);
  const ip = req.ip;
  const userAgent = req.headers["user-agent"] || "";
  await createRefreshToken({ user, jti, refreshToken, ip, userAgent });
  setRefreshCookie(options, refreshToken);
  await user.update({ lastLogin: new Date() });
  return { accessToken };
};

/**
 * Creates new access token using refresh token
 * @param {Object} options
 * @returns {String} accessToken
 */
const refreshToken = async (options = {}) => {
  const { req, res } = options;
  const token = req.cookies?.refresh_token || "";
  if (!token) {
    const error = new Error("Refresh token not recognized");
    error.status = 401;
    throw error;
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
  } catch (err) {
    const error = new Error("Invalid or expired refresh token");
    error.status = 401;
    throw error;
  }

  const jti = createJti();
  const tokenHash = hashToken(token);
  const existing = await refreshTokenRepo.findOne({
    where: { tokenHash, jti: decoded.jti },
    include: {
      model: db.users,
      as: "user",
      attributes: ["id", "email", "emailVerified"],
      include: { model: db.roles, as: "role", attributes: ["id", "name"] },
    },
  });

  if (!existing) {
    const error = new Error("Refresh token not recognized");
    error.status = 401;
    throw error;
  }

  if (existing.revoked) {
    const error = new Error("Refresh token has been revoked");
    error.status = 401;
    throw error;
  }

  if (existing.expiresAt < new Date()) {
    await logout(options);
    const error = new Error("Refresh token has expired");
    error.status = 401;
    throw error;
  }

  const { accessToken } = await rotateRefreshToken(
    existing,
    jti,
    existing.user,
    options,
  );

  return { accessToken };
};

/**
 * Logout user
 * @param {Object} options
 * @returns {String} message
 */
const logout = async (options = {}) => {
  const { req, res } = options;
  const token = req.cookies?.refresh_token || "";
  if (!token) {
    const error = new Error("Refresh token not recognized");
    error.status = 401;
    throw error;
  }

  const tokenHash = hashToken(token);
  const existing = await refreshTokenRepo.findOne({ where: { tokenHash } });

  if (existing && !existing.revokedAt) {
    await existing.update({ revokedAt: new Date() });
  }

  res.clearCookie("refresh_token", { path: "/" });
  return { message: "Logged out successfully" };
};

/**
 * @param {Object} data
 * @param {String} data.email
 * @param {String} data.password
 * @param {String} data.firstName
 * @param {String} data.lastName
 * @param {String} data.roleId
 * @param {String} data.gender
 * @param {String} data.dob
 * @param {String} data.phoneNumber
 * @returns {Promise<Object>} New User Object
 */
const register = async (data) => {
  const {
    email,
    password,
    firstName,
    lastName,
    roleId,
    gender,
    dob,
    phoneNumber,
    address,
  } = data;

  if (email && !isEmailValid(email)) {
    const error = new Error("Invalid Email Address");
    error.status = 401;
    throw error;
  }
  const hashedPasswod = await bcrypt.hash(password, 10);

  const emailExists = await userRepository.findByEmail(email);
  if (emailExists) {
    const error = new Error("Email already exists");
    error.status = 409;
    throw error;
  }

  //   Checks is user is upto eighteen years old
  if (dob && !isNaN(new Date(dob).getTime()) && !isUserAtLeastEighteen(dob)) {
    const error = new Error("User must be at least eighteen years old");
    error.status = 400;
    throw error;
  }

  const role = roleId
    ? await roleRepository.findById(roleId)
    : await roleRepository.findOne({ where: { name: "customer" } });

  if (!role) {
    const error = new Error("Role not found");
    error.status = 404;
    throw error;
  }

  if (!role.isActive) {
    const error = new Error("Role is not activated yet");
    error.status = 400;
    throw error;
  }

  const user = await userRepository.create({
    email,
    password: hashedPasswod,
    firstName,
    lastName,
    roleId: role.id,
    gender,
    dob,
    phoneNumber,
    address,
  });

  const token = createJti();
  const hashedToken = hashToken(token);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 days from now

  await tokensRepository.create({
    userId: user.id,
    tokenHash: hashedToken,
    purpose: "email_verification",
    expiresAt,
  });

  const mailOption = {
    to: email,
    subject: "Email Verification",
    html: emailVerificationMail(token),
  };

  // Enqueue the verification emails to be sent asynchronously
  await enqueEmailVerificationEmail(mailOption);
  return user;
};

/**
 * Forgot password updates the user's password and sends a reset email
 * @param {String} email
 * @returns {Promise<Object>} { message: String }
 */
const forgotPassword = async (email) => {
  if (!isEmailValid(email)) {
    const error = new Error("Invalid Email Address");
    error.status = 400;
    throw error;
  }

  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error(
      "If an account with that email exists, a password reset link has been sent.",
    );
    error.status = 400;
    throw error;
  }

  const token = createJti();
  const hashedToken = hashToken(token);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

  await tokensRepository.create({
    userId: user.id,
    tokenHash: hashedToken,
    purpose: "password_reset",
    expiresAt,
  });
  const mailOption = {
    to: user.email,
    subject: "Password Reset",
    html: passwordResetMail(token),
  };

  // Enqueue the password reset email to be sent asynchronously
  await enquePasswordResetEmail(mailOption);
  return {
    message:
      "If an account with that email exists, a password reset link has been sent.",
  };
};

/**
 * Resets the user's password using a valid reset token
 * @param {String} token
 * @param {String} newPassword
 */
const resetPassword = async (data) => {
  const { token, newPassword } = data;
  const hashedToken = hashToken(token);
  const existingToken = await tokensRepository.findOne({
    where: { tokenHash: hashedToken, purpose: "password_reset" },
  });

  if (!existingToken) {
    const error = new Error("Token not recognized");
    error.status = 400;
    throw error;
  }

  if (existingToken.expiresAt < new Date()) {
    const error = new Error("Invalid or expired reset token");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userRepository.update(existingToken.userId, {
    password: hashedPassword,
  });

  // await existingToken.update({isUsed: true});
  return { message: "Password reset successfully" };
};

/**
 * Verifies the user's email using a valid verification token
 * @param {String} token
 * @returns {Promise<Object>} { message: String }
 */
const verifyEmail = async (token) => {
  const hashedToken = hashToken(token);
  const existingToken = await tokensRepository.findOne({
    where: { tokenHash: hashedToken, purpose: "email_verification" },
    include: {
      model: db.users,
      as: "user",
      attributes: ["firstName", "email"],
      isUsed: false,
    },
  });

  if (!existingToken) {
    const error = new Error("Invalid or used verification token");
    error.status = 400;
    throw error;
  }

  if (existingToken.expiresAt < new Date()) {
    const error = new Error("Invalid or expired verification token");
    error.status = 400;
    throw error;
  }

  await userRepository.update(existingToken.userId, {
    emailVerified: true,
    status: "active",
  });
  await existingToken.update({ isUsed: true });

  const mailOption = {
    to: existingToken.user.email,
    subject: "Welcome to LogiFlow",
    html: welcomeMail(existingToken.user.firstName),
  };

  // Enqueue the welcome email to be sent asynchronously
  await enqueWelcomeEmail(mailOption);

  return { message: "Email verified successfully" };
};

module.exports = {
  login,
  refreshToken,
  logout,
  register,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
