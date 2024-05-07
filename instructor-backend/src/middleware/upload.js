const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let destFolder;
        if (file.mimetype.startsWith('video')) {
            destFolder = 'uploads/videos/';
        } else {
            destFolder = 'uploads/files/';
        }
        cb(null, destFolder);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
