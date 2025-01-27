const { json } = require('body-parser')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './file-uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        cb(null, 'SmartHosp_' + uniqueSuffix + '_' + file.originalname)
    }
})

const MAX_FILE_SIZE = 2 * 1024 * 1024;  // 3 MB

exports.uploadAllTypeFile = multer({
    storage: storage,
    limits:{fileSize: MAX_FILE_SIZE},
    fileFilter: (req, file, cb) =>{
        checkFileType(file, cb);
    }
}).single('file_name')

// Check file type
function checkFileType(file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname));
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        //   return cb('ต้องเป็นไฟล์ PDF เท่านั้น!!');
        return cb(null, false);
    }
}
