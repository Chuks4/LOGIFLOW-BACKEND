const jwt = require("jsonwebtoken");
const privateKey = process.env.JWT_SECRET_KEY;
const refreshKey = process.env.JWT_REFRESH_SECRET_KEY;

const authAccess = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, headerToken] = header.split(" ");
  const cookiesToken = req.cookies?.refresh_token;
  const token = scheme === "Bearer" && headerToken ? headerToken : cookiesToken;
  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "No token provided" });
  }

  try {
    const key = headerToken ? privateKey : refreshKey;
    const decoded = jwt.verify(token, key);
    req.user = decoded;

    if (!req.user.emailVerified && !req.path.includes("/verify-email")) {
      return res
        .status(401)
        .json({
          status: false,
          message: "Please verify your email to access this resource",
        });
    }
    next();
  } catch (error) {
    if (error === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
      });
    } else if (error === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
      });
    } else {
      return res.status(401).json({
        message: error,
      });
    }
  }
};

module.exports = authAccess;
