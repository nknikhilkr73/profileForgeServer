
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios'); // Import Axios for making HTTP requests
const router = express.Router()
const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.json());

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'nkmajorkr@gmail.com', // Your Gmail email address
        pass: 'frny paiq moho fbjr', // Your Gmail password
    },
});

// Start quiz endpoint
router.post('/start-quiz', async (req, res) => {
    try {
        // Fetch student data from /api/students/getStudent endpoint
        const studentsResponse = await axios.get('http://localhost:4000/api/students/getAllStudents');

        const response = await axios.get('http://localhost:4000/api/status/quizstatus')
        console.log(response.data)
        // Extract student emails from the fetched data
        const studentEmails = studentsResponse.data.map((student) => student.email);
        console.log(studentEmails);
        // Send email notifications to students
        sendEmailNotifications(studentEmails);

        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error('Error starting quiz:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to send email notifications to students
const sendEmailNotifications = (emails) => {
    emails.forEach((email) => {
        const mailOptions = {
            from: 'nkmajorkr@gmail.com', // Your email address
            to: email,
            subject: 'Quiz Started',
            text: 'The quiz has started. Please login to take the quiz.',
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    });
};




module.exports = router;


