const userRepository = require("../repositories/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const refreshTokenRepo = require("../repositories/refreshToken");
const db = require("../models");
const roleRepository = require("../repositories/role");
const emailService = require("../services/email");

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

  const { req, res } = options;
  const user = await userRepository.findByEmail(email);
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
    userId: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
  };
  const accessToken = signAccessToken(payload);
  const jti = createJti();
  const refreshToken = signRefreshToken(payload, jti);
  const ip = req.ip;
  const userAgent = req.headers["user-agent"] || "";

  await createRefreshToken(user, refreshToken, jti, ip, userAgent);
  setRefreshCookie(res, refreshToken);
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
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    const error = new Error("Invalid or expired refresh token");
    error.status = 401;
    throw error;
  }

  const tokenHash = hashToken(token);
  const existing = await refreshTokenRepo.findOne({
    tokenHash,
    jti: decoded.jti,
    include: { model: db.users, as: "user" },
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
    const error = new Error("Refresh token has expired");
    error.status = 401;
    throw error;
  }

  const { accessToken } = await rotateRefreshToken(
    existing,
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
  const existing = await refreshTokenRepo.findOne({ tokenHash });

  if (existing && !existing.revokedAt) {
    await existing.update({ revokedAt: new Date() });
  }

  res.clearCookie("refresh_token", { path: "/api/v1/auth/refresh" });
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

  const user = await userRepository.create({
    email,
    password: hashedPasswod,
    firstName,
    lastName,
    roleId: role.id,
    gender,
    dob,
    phoneNumber,
  });

  const mailOption = {
    to: user.email,
    subject: "Welcome to LogiFlow",
    html: welcomeMail(`${user.firstName}`),
  };

  sendEmail(mailOption).catch((err) => {
    console.error("Error sending welcome email:", err);
  });
  return user;
};

module.exports = {
  login,
  refreshToken,
  logout,
  register,
};
