const userRepository = require("../repositories/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const refreshTokenRepo = require("../repositories/refreshToken");
const db = require("../models");

const {
  isEmailValid,
  signAccessToken,
  createJti,
  signRefreshToken,
  createRefreshToken,
  setRefreshCookie,
  hashToken,
  rotateRefreshToken,
} = require("../utils/util");

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

  const payload = { userId: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const jti = createJti();
  const refreshToken = signRefreshToken(payload, jti);
  const ip = req.ip;
  const userAgent = req.headers["user-agent"] || "";

  await createRefreshToken(user, refreshToken, jti, ip, userAgent);
  setRefreshCookie(res, refreshToken);
  return { accessToken };
};

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

module.exports = {
  login,
  refreshToken,
  logout,
};
