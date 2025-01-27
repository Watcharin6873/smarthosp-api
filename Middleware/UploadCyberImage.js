const { json } = require('body-parser')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './cyber-image')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        cb(null, 'CyberImage_' + uniqueSuffix + '_' + file.originalname)
    }
})

exports.uploadCyberImage = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('cyber_image')

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|PNG|pdf/;
    const extname = filetypes.test(path.extname(file.originalname));
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        //   return cb('ต้องเป็นไฟล์ PDF เท่านั้น!!');
        return cb(null, false);
    }
}
