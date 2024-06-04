const mongoose = require("mongoose")
const { Schema } = mongoose

const QuizTimeLimitSchema = new Schema({
    timelimit: {
        type: Number,
        default:10
    }
})

module.exports = mongoose.model('quiztimelimit', QuizTimeLimitSchema)