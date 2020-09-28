const express = require("express");
const router = express.Router();

const note = require("../models/Note");

router.get("/notes/add", (req, res) =>{
    res.render("notes/new-notes")
});

router.post("/notes/new-notes", async (req, res)=>{
    const {title, description}= req.body;
    const errors = [];
    if (!title){
        errors.push({text: "Por favor inserte un titulo"})
    }
    if (!description){
        errors.push({text: "Por favor inserte una descripción"})
    }
    if(errors.length > 0){
        res.render("notes/new-notes",{
           errors,
           title,
           description 
        });
    } else{
        const newNote = new note({title, description});
        console.log(newNote)
        await newNote.save()
        req.flash("success_msg", "Note Added Successfully")
        res.redirect("/notes")
    }
})


router.get('/notes', async (req, res) => {
    await note.find().sort({date: "desc"})
      .then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
            return {
                _id: documento._id,
                title: documento.title,
                description: documento.description}
          })
        }
        res.render('notes/all-notes', {notes: contexto.notes }) 
      })
  })

router.get("/notes/edit/:id", async (req, res)=>{
       await note.findById(req.params.id)
       .then(documentos => {
            const contexto = {
                notes:{
                _id: documentos._id,
                title: documentos.title,
                description: documentos.description}
        };
        res.render('notes/edit-note', {notes: contexto.notes}) 
    })
});


router.put("/notes/edit-note/:id", async (req, res) => {
    const {title, description} = req.body;
    await note.findByIdAndUpdate(req.params.id, {title,description})
    req.flash("success_msg", "Nota actualizada satisfactoriamaente");
    res.redirect('/notes');
})

router.delete("/notes/delete/:id", async(req,res)=>{
    await note.findByIdAndRemove(req.params.id);
    req.flash("success_msg", "Nota eliminada satisfactoriamaente");
    res.redirect("/notes")
})



    module.exports = router;