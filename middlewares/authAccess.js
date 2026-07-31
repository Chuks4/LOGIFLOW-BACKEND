const jwt = require("jsonwebtoken");
const privateKey = process.env.JWT_SECRET;

const authAccess = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, headerToken] = header.split(" ");
  const cookiesToken = req.cookies.access_token;
  const token = scheme === "Bearer" && headerToken ? headerToken : cookiesToken;
  if (!token) throw new Error("No token provided");

  try {
    const decoded = jwt.verify(token, privateKey);
    req.user = decoded;

    if (!req.user.emailVerified && !req.path.includes("/verify-email")) {
      return res.status(401).json({
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
