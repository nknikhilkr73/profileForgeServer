const connectToMongo = require("./db")
const express = require('express')
const cors = require('cors')
const path = require('path');

connectToMongo();

const app = express();
const port = 4000;

app.use(cors())

app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/students', require('./routes/student'))

app.use('/api/notes', require('./routes/notes'))

app.use('/api/students/data', require('./routes/data'))

app.use('/api/student/profile', require('./routes/profileimage'))

app.use('/api/admin', require('./routes/admin'))

app.use('/api/quiz', require('./routes/quiz'))

app.use('/api/status', require('./routes/quizstatus'));

app.use('/quiz', require('./routes/quiztime'))

app.use('/question', require('./routes/quizdetails'))

app.use('/quiztimelimit', require('./routes/quiztimelimit'))

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})