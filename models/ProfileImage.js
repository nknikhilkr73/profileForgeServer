
const mongoose = require('mongoose')
const { Schema } = mongoose

const ImageSchema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    profileimage: {
        type: String
    },
    date: {
        type: String,
        default: Date.now
    }
})

module.exports = mongoose.model('image', ImageSchema)