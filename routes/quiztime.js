const express = require('express')
const router = express.Router()
const QuizTime = require("../models/QuizTime")

router.post("/time/save", async (req, res) => {

    try {
        const { quizStarted, quizEndTime } = req.body

        const newQuizTime = new QuizTime({
            quizStarted, quizEndTime
        })
        const savedQuizTime = await newQuizTime.save()

        res.json(savedQuizTime)

    } catch (error) {
        console.error("Error posting quiz time:", error);
        res.status(500).json({ error: "Internal server error" });
    }

})


// GET quiz time
router.get("/quiztime", async (req, res) => {
    try {
        // Retrieve quiz time data from the database
        const quizTimeData = await QuizTime.find();

        // Respond with the retrieved quiz time data
        res.json(quizTimeData);
    } catch (error) {
        console.error("Error getting quiz time:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


//Update the quiz Started and its timing 

router.put("/time/update", async (req, res) => {
    try {
        const { quizStarted, quizEndTime } = req.body

        const quiz = await QuizTime.findOne()

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz time entry not found' });

        }

        quiz.quizStarted = quizStarted
        quiz.quizEndTime = quizEndTime

        const updatedQuiz = await quiz.save()

        res.json(updatedQuiz)

    } catch (error) {
        console.error('Error updating quiz time:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


module.exports = router;