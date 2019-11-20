
const express = require("express");
const ImageRouter = express.Router();
const multer = require("multer");
var path = require('path');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.PATH_FILES_UPLOAD);
    },
    filename: function (req, file, cb) {
        console.log('filename');
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

let fileFilter = (req, file, cb) => {
    console.log("fileFilter");
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
let uploadImage = multer({
    storage: storage,
    // limits: {
    //     fileSize: 1024 * 1024 * 5
    // },
    // fileFilter: fileFilter,
    // onError: function (err, next) {
    //     console.log('error desde aca', err);
    //     next(err);
    // }
});

module.exports = uploadImage;