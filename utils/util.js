const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const privateAccessToken = process.env.JWT_SECRET_KEY;
const privateRefreshToken = process.env.JWT_REFRESH_SECRET_KEY;
const REFRESH_TTL_SEC = process.env.REFRESH_TTL_SEC;
const db = require("../models");

const signAccessToken = (payload) => {
  return jwt.sign(payload, privateAccessToken, { expiresIn: "24h" });
};

const signRefreshToken = (payload, jti) => {
  return jwt.sign({ ...payload, jti }, privateRefreshToken, {
    expiresIn: "7d",
  });
};

const hashToken = (token) => {
  const stringified = String(token);
  return crypto.createHash("sha256").update(stringified).digest("hex");
};

const createJti = () => {
  return crypto.randomBytes(16).toString("hex");
};

const createRefreshToken = async ({
  user,
  jti,
  refreshToken,
  ip,
  userAgent,
}) => {
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_SEC * 1000);
  return await db.refreshToken.create({
    userId: user?.id,
    tokenHash,
    jti,
    expiresAt,
    ip,
    userAgent,
  });
};

const setRefreshCookie = (option = {}, refreshToken) => {
  const { res } = option;
  const isProd = process.env.NODE_ENV === "production";
  return res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: parseInt(REFRESH_TTL_SEC) * 1000,
  });
};

const rotateRefreshToken = async (token, jti, user, options = {}) => {
  const { req, res } = options;
  // revoke old
  token.revokedAt = new Date();
  const newJti = createJti();
  await token.update({ replacedBy: newJti });

  // issue new
  const payload = {
    id: user?.id,
    email: user?.email,
    emailVerified: user?.emailVerified,
    roleId: user?.role?.id,
    userType: user?.role?.name,
  };
  const newAccess = signAccessToken(payload);
  const newRefresh = signRefreshToken(payload, newJti);
  await createRefreshToken({
    user: user,
    refreshToken: newRefresh,
    ip: req.ip,
    jti,
    userAgent: req.headers["user-agent"] || "",
  });

  setRefreshCookie(options, newRefresh);
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

const deleteFile = (path) => {
  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
      console.log("File deleted successfully");
    } else {
      console.log("File does not exist");
    }
  } catch (error) {
    console.log("Error deleting file: ", error);
  }
};

const generateTrackingNumber = () => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const random = "";
  for (let i = 0; i < 8; i++) {
    const index = crypto.randomInt(0, characters.length);
    random += characters[index];
  }
  return `LOGI-${random}`;
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
  deleteFile,
  generateTrackingNumber,
};
