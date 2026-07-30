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
    next();
  } catch (error) {
    if (error === "TokenExpiredError") {
      throw new Error("Token expired");
    } else if (error === "JsonWebTokenError") {
      throw new Error("Invalid token");
    } else {
      throw error;
    }
  }
};

module.exports = authAccess;
