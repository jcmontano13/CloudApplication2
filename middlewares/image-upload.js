const multer = require('multer');
const uuid = require('uuid').v4;

const upload = multer({
    storage: multer.diskStorage({            // method that take configuration storage
        destination: 'product-data/images',
        filename: function (req, file, cb) {
            cb(null, uuid() + '_' + file.originalname);
        }
    })
});

const configureMulterMiddleware = upload.single('image'); // image from the new products hmtl

module.exports = configureMulterMiddleware;