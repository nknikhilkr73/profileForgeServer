const express = require('express')
const router = express.Router()
const ProfileImage = require('../models/ProfileImage')
const fetchstudent = require('../middleware/fetchstudent')
const multer = require('multer')
const path = require('path')
const jwt = require('jsonwebtoken');
const JWT_SECRET = "You are a good boy"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads"))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        cb(null, file.fieldname + '_' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit (adjust as needed)
    }
})



router.post('/profileImage', [fetchstudent, upload.single('file')], async (req, res) => {


    try {

        console.log(req.student);
        console.log(req.file);

        ProfileImage.create({ profileimage: req.file.filename, student: req.student.id }).then(results => {
            res.json(results)
        }).catch(err => {
            console.log(err);
        })


    } catch (error) {
        console.log(error);
    }

})



router.get('/getImage', (req, res) => {
    ProfileImage.find()
        .then(images => res.json(images))
        .catch(err => console.log(err))
})


module.exports = router