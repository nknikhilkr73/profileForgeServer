const express = require('express')

const Student = require('../models/Student')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchstudent = require('../middleware/fetchstudent')
const JWT_SECRET = "You are a good boy"

const { query, matchedData, body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads"))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        cb(null, file.fieldname + '_' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })



//route 1
//create user
router.post('/createstudent', upload.single('image'), [

    body('name', "Enter a valid name(length > 3)").isLength({ min: 3 }),
    body('email', "Enter a valid and unique email").isEmail(),
    body('password', "Password length should be more than 5").isLength({ min: 5 }),

], async (req, res) => {

    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let student = await Student.findOne({ email: req.body.email })
    if (student) {
        return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }

    const salt = await bcrypt.genSalt(10)
    const securePassword = await bcrypt.hash(req.body.password, salt)


    student = await Student.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
        image: req.file.filename
    })
    const data = {
        student: {
            id: student.id,
            name: student.name,
            email: student.email
        }
    }

    var token = jwt.sign(data, JWT_SECRET);

    res.json({ token })

})

//router 2
//authenticate the user (login)

router.post('/login', [

    body('email', "Enter a valid and unique email").isEmail(),
    body('password', "Password cannot be blank").exists(),

], async (req, res) => {

    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body
    try {
        let student = await Student.findOne({ email })

        if (!student) {
            return res.status(400).json({ error: "Student not registered" })

        }
        const passwordCompare = await bcrypt.compare(password, student.password)

        if (!passwordCompare) {
            return res.status(400).json({ error: "Please Try logging in with the correct credentials" })

        }
        const data = {
            student: {
                id: student.id,
                name: student.name,
                email: student.email
            }
        }

        let token = jwt.sign(data, JWT_SECRET)
        res.json({ token })

    } catch (error) {
        console.log(error);
    }
}
)

//router 3
//Get user data

router.post('/getStudent', fetchstudent, async (req, res) => {

    try {

        const studentId = req.student.id

        const student = await Student.findById(studentId).select('-password')

        res.send(student)
    } catch (error) {
        console.log(error);
    }
})

router.get('/getAllStudents', async (req, res) => {
    try {
        const students = await Student.find().select('-password');
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/uploadMarks', fetchstudent, async (req, res) => {

    const studentId = req.student.id

    // const studentId = req.params.id;
    const { date, value } = req.body;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Add the new mark to the marks array
        student.marks.push({ date, value });
        await student.save();

        res.status(201).json({ message: 'Marks uploaded successfully', student });
    } catch (error) {
        console.error('Error uploading marks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/individualmarks', fetchstudent, async (req, res) => {
    const studentId = req.student.id
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(student.marks)

    } catch (error) {
        console.error("Error finding the student's marks:", error);
        res.status(500).json({ error: 'Internal server error' });
    }

})

// router.get('/allmarks', async (req, res) => {

//     try {
//         const students = await Student.find().select('-password');
//         console.log(students);
//         res.json(students.marks)

//     } catch (error) {
//         console.error("Error finding the student's marks:", error);
//         res.status(500).json({ error: 'Internal server error' });
//     }

// })


router.get('/allmarks', async (req, res) => {
    try {
        const students = await Student.find().select('-password');

        // Extract and log marks arrays
        const allMarks = students.map(student => {
            console.log(student);
            return {
                studentId: student._id,
                name: student.name,
                marks: student.marks
            };
        });



        res.json(allMarks);
    } catch (error) {
        console.error("Error finding the student's marks:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router