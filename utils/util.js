const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const privateAccessToken = process.env.JWT_SECRET_KEY;
const privateRefreshToken = process.env.JWT_REFRESH_SECRET_KEY;
const REFRESH_TTL_SEC = process.env.REFRESH_TTL_SEC;
const db = require("../models");

const signAccessToken = (payload) => {
  jwt.sign(payload, privateAccessToken, { expiresIn: "15m" });
};

const signRefreshToken = (payload, jti) => {
  jwt.sign({ ...payload, jti }, privateRefreshToken, {
    expiresIn: REFRESH_TTL_SEC,
  });
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const createJti = () => {
  return crypto.randomBytes(16).toString("hex");
};

const createRefreshToken = async ({
  user,
  refreshToken,
  jti,
  ip,
  userAgent,
}) => {
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_SEC * 1000);
  await db.refreshToken.create({
    userId: user.id,
    tokenHash,
    jti,
    expiresAt,
    ip,
    userAgent,
  });
};

const setRefreshCookie = (option = {}, refreshToken) => {
  const isProd = process.env.NODE_ENV === "production";
  options.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/api/v1/auth/refresh",
    maxAge: REFRESH_TTL_SEC * 1000,
  });
};

const rotateRefreshToken = async (token, user, options = {}) => {
  const { req, res } = options;
  // revoke old
  token.revokedAt = new Date();
  const newJti = createJti();
  await token.update({ replacedBy: newJti });

  // issue new
  const newAccess = signAccessToken(user);
  const newRefresh = signRefreshToken(user, newJti);
  await createRefreshToken({
    userId: user.id,
    refreshToken: newRefresh,
    jti: newJti,
    ip: req.ip,
    userAgent: req.headers["user-agent"] || "",
  });

  setRefreshCookie(res, newRefresh);
  return { accessToken: newAccess };
};

const isEmailValid = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

const isUserAtLeastEighteen = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age >= 18;
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  hashToken,
  createJti,
  createRefreshToken,
  setRefreshCookie,
  rotateRefreshToken,
  isEmailValid,
  isUserAtLeastEighteen,
};
