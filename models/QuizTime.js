const mongoose = require("mongoose")
const { Schema } = mongoose

const QuizTimeSchema = new Schema({
    quizStarted: {
        type: String,
    },
    quizEndTime: {
        type: Date
    }
})

module.exports = mongoose.model('quiztime', QuizTimeSchema)