const mongoose = require("mongoose")
const { Schema } = mongoose

const QuizQuestionSchema = new Schema({
    question: {
        type: String
    },
    options: {
        type: [String],
        // required: true
    },
    correctAnswerIndex: {
        type: Number,
        // required: true
    },
    answer: {
        type: String,

    },
    timelimit: {
        type: Number
    }
})

module.exports = mongoose.model('quizquestions', QuizQuestionSchema)