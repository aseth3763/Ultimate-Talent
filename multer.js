const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Upload/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = file.originalname;
    cb(null, uniqueSuffix);
  }
});

const fileFilter = (req, file, cb) => {

const allowedTypes = ['image/jpeg',"image/jpg", 'image/png', 'image/gif', 'application/pdf'];
  
if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error('Only image and PDF files are allowed'), false); 
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});


module.exports = upload;
