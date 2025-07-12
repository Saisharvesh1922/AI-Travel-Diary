const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.files);
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null,Date.now()+path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};


const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;