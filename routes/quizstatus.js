
// Import necessary modules
const express = require('express');
const router = express.Router();

// Endpoint to get the status of the quiz
router.get('/quizstatus', (req, res) => {
    // Check if the quiz has started (you can implement your own logic here)
    const quizStarted = true; // Example: Set to true if the quiz has started

    // If the quiz has started, calculate its end time (e.g., 30 minutes from the start time)
    let quizEndTime = null;
    if (quizStarted) {
        const startTime = new Date(); // Example: Get the start time from your database or other source

        quizEndTime = new Date(startTime.getTime() + 30 * 60000); // Set the end time to 30 minutes from the start time

    }

    // Send the quiz status (whether it has started and its end time) to the client
    res.json({ quizStarted, quizEndTime });
});

// Export the router
module.exports = router;
