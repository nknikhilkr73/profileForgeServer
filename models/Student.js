const mongoose = require('mongoose');

const { Schema } = mongoose;

const StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String, // Assuming you will store the path or URL to the image
        // default: './defaultProfilePic.png' // You can specify a default image path if needed
    },
    marks: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            value: {
                type: Number,

            }
        }
    ],

    date: {
        type: String,
        default: Date.now
    }
});
const Student = mongoose.model('student', StudentSchema)

module.exports = Student