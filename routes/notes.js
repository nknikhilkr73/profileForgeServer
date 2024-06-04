const express = require("express")
const router = express.Router()
const Notes = require('../models/Notes')
const fetchstudent = require("../middleware/fetchstudent")
const { query, matchedData, body, validationResult } = require('express-validator');

//route1
router.get("/fetchallnotes", fetchstudent, async (req, res) => {
    const notes = await Notes.find({ student: req.student.id })
    res.json(notes)
})

//router 2
//add notes
router.post('/addnote', fetchstudent, [

    body('title', "Enter a valid title)").isLength({ min: 3 }),
    body('description', "Description must be atleast 5 characters").isLength({ min: 5 }),

], async (req, res) => {
    try {
        const { title, description, tag } = req.body
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Notes({
            title, description, tag, student: req.student.id
        })
        const saveNote = await note.save()
        res.json(saveNote)

    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Internl server Error" });
    }
})


//route 3
//update the notes
router.put('/updatenote/:id', fetchstudent,
    async (req, res) => {

        try {
            const { title, description, tag } = req.body

            //create newNote object
            const newNote = {}

            if (title) { newNote.title = title }
            if (description) { newNote.description = description }
            if (tag) { newNote.tag = tag }

            //find the note to be updated

            let note = await Notes.findById(req.params.id)
            if (!note) { return res.status(404).send("Not found") }


            if (note.student.toString() !== req.student.id) {
                return res.status(401).send("Not allowed")
            }

            note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })

            res.json(note)
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: "Internl server Error" });
        }
    })


//route 4
//delete the notes
router.delete('/deletenote/:id', fetchstudent,
    async (req, res) => {

        try {
            //find the note to be deleted

            let note = await Notes.findById(req.params.id)
            if (!note) { return res.status(404).send("Not found") }

            //alow deletion only if the user owns the note
            if (note.student.toString() !== req.student.id) {
                return res.status(401).send("Not allowed")
            }

            note = await Notes.findByIdAndDelete(req.params.id)

            res.json({ success: 'note has been deleted', note: note })

        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: "Internl server Error" });
        }
    })



module.exports = router;