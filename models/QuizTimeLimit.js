const mongoose = require("mongoose")
const { Schema } = mongoose

const QuizTimeLimitSchema = new Schema({
    timelimit: {
        type: Number
    }
})

module.exports = mongoose.model('quiztimelimit', QuizTimeLimitSchema)