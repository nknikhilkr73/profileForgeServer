const express = require('express')
const router = express.Router()
const QuizQuestions = require("../models/QuizQuestions")

router.get('/allQuestions', async (req, res) => {
    const data = await QuizQuestions.find()
    res.json(data)
})

router.post('/addQuestion', async (req, res) => {

    try {

        // const { question, answer, timelimit } = req.body

        const { question, options, correctAnswerIndex, answer } = req.body;

        const data = new QuizQuestions({
            // question, answer, timelimit
            question,
            options,
            correctAnswerIndex,
            answer

        })

        const saveQuestion = await data.save()
        res.json(saveQuestion)

    } catch (error) {

        return res.status(401).json({ error: "Cant save the Question" });
    }
})

router.put('/updateQuestion/:id', async (req, res) => {

    try {

        // const { question, answer, timelimit } = req.body

        const { question, options, correctAnswerIndex, answer } = req.body

        let newQuestions = {}
        if (question) { newQuestions.question = question }
        if (options) newQuestions.options = options;
        if (correctAnswerIndex) newQuestions.correctAnswerIndex = correctAnswerIndex;
        if (answer) { newQuestions.answer = answer }
        // if (timelimit) { newQuestions.timelimit = timelimit }


        let data = await QuizQuestions.findById(req.params.id)
        if (!data) { return res.status(404).send("Not found") }


        data = await QuizQuestions.findByIdAndUpdate(req.params.id, { $set: newQuestions }, { new: true })
        res.json(data)

    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Cant update the Questions" });
    }

})

router.delete('/deleteQuestion/:id', async (req, res) => {
    try {

        let data = await QuizQuestions.findById(req.params.id)
        if (!data) { return res.status(404).send("Not found") }

        data = await QuizQuestions.findByIdAndDelete(req.params.id)
        res.json({ success: 'Question has been deleted' })

    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Cant delete the question" });
    }
})


module.exports = router;
