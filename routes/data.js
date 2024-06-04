const express = require('express')
const fetchstudent = require('../middleware/fetchstudent')
const Data = require('../models/Data')
const router = express.Router()

const { query, matchedData, body, validationResult } = require('express-validator');

//router 0
//Get all user's data alltogether

router.get('/getallstudentsdata', async (req, res) => {
    const data = await Data.find()
    res.json(data)
})


//router1
//get all Data

router.get('/fetchalldata', fetchstudent, async (req, res) => {
    const data = await Data.find({ student: req.student.id })
    res.json(data)
})

//router 2
//Add the data

router.post('/addData', fetchstudent, [

    body('registrationNo', "Enter a valid registration Number)").isLength({ min: 10 }),
    body('section', "Please Provide your Section"),
    body('semester', "Please Provide your Semester")

], async (req, res) => {

    try {

        const { registrationNo, section, semester, skills, cgpa, placement } = req.body
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const data = new Data({
            registrationNo, section, semester, student: req.student.id, skills, cgpa, placement
        })
        // , name: req.student.name, email: req.student.email
        const { name, email } = req.student

        const saveData = await data.save()

        res.json(saveData)


    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Internl server Error" });

    }

})

//router 3
//update data

router.put('/updateData/:id', fetchstudent, async (req, res) => {

    try {

        const { registrationNo, section, semester, skills, cgpa, placement } = req.body

        const newData = {}
        if (registrationNo) { newData.registrationNo = registrationNo }
        if (section) { newData.section = section }
        if (semester) { newData.semester = semester }
        if (skills) { newData.skills = skills }
        if (cgpa) { newData.cgpa = cgpa }
        if (placement) { newData.placement = placement }

        let data = await Data.findById(req.params.id)
        if (!data) {
            return res.status(404).send("Not found")
        }


        if (data.student.toString() !== req.student.id) {
            return res.status(401).send("Not allowed")
        }
        data = await Data.findByIdAndUpdate(req.params.id, { $set: newData }, { new: true })

        res.json(data)
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Internl server Error" });

    }

})

//router 4
//delete data

router.delete('/deletedata:/:id', fetchstudent, async (req, res) => {
    try {
        let data = Data.findById(req.params.id)

        if (!data) {
            return res.status(404).send("Not found")
        }

        if (data.student.toString() !== req.student.id) {
            return res.status(401).send("Not allowed")
        }

        data = await Data.findByIdAndDelete(req.params.id)

        res.json({ success: "Data deleted" })

    } catch (error) {

    }
})


module.exports = router;