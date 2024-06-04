const express = require('express')
const router = express.Router()
const QuizTimeLimit = require("../models/QuizTimeLimit")

router.post("/timelimit/save", async (req, res) => {

    try {
        const { timelimit } = req.body

        const newQuizTime = new QuizTimeLimit({
            timelimit
        })
        const savedQuizTime = await newQuizTime.save()

        res.json(savedQuizTime)

    } catch (error) {
        console.error("Error posting quiz time:", error);
        res.status(500).json({ error: "Internal server error" });
    }

})


// GET quiz time
router.get("/getquiztimelimit", async (req, res) => {
    try {
        // Retrieve quiz time data from the database
        const quizTimeData = await QuizTimeLimit.find();

        // Respond with the retrieved quiz time data
        res.json(quizTimeData);
    } catch (error) {
        console.error("Error getting quiz time:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


//Update the quiz Started and its timing 

router.put("/timelimit/update", async (req, res) => {
    try {
        const { timelimit } = req.body

        const quiz = await QuizTimeLimit.findOne()

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz time entry not found' });

        }

        quiz.timelimit = timelimit


        const updatedQuiz = await quiz.save()

        res.json(updatedQuiz)

    } catch (error) {
        console.error('Error updating quiz time:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


module.exports = router;
