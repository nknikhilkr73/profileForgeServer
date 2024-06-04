const mongoose = require('mongoose');

const { Schema } = mongoose;

const DataSchema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },

    registrationNo: {
        type: Number,
        required: true,

    },
    section: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    skills: {
        type: Array,
        default: ['Html', 'Css', 'JavaScript', 'Java', 'ReactJs']

    },
    cgpa: {
        type: Number
    },
    placement: {
        type: String,

    },

    date: {
        type: String,
        default: Date.now
    }
});

module.exports = mongoose.model('data', DataSchema)