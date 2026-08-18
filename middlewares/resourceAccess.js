const allowOnly = (...userType) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    next();
  };
};

module.exports = {
  allowOnly,
};
