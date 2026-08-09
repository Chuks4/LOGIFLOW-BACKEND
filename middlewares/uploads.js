const multer = require("multer");
const path = require("path");

// Uploads Destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ex = path.extname(file.originalname);
    const uniqueName = `${Date.now()}${Math.round(Math.random() * 1e9)}${ex}`;
    cb(null, uniqueName);
  },
});

const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
const allowedExt = [".jpg", ".jpeg", ".png"];
const fileFilter = (req, file, cb) => {
  if (
    allowedTypes.includes(file.mimetype) &&
    allowedExt.includes(path.extname(file.originalname).toLowerCase())
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, JPG are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, //5MB
}).fields([{ name: "image", maxCount: 1 }]);

const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
    next();
  });
};

module.exports = handleUpload;
