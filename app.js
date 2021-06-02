const express = require('express');
const ejs = require('ejs');
const path=require('path')
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();
const fileUpload = require('express-fileupload');
const Photo = require('./models/Photo')
const fs = require('fs');
//middleware
app.use(fileUpload());
app.use(methodOverride('_method',{
  methods:['POST','GET']
}));
app.use(express.static('public'));
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())
//template engine
app.set("view engine", "ejs");
//mongo connect
mongoose.connect('mongodb://localhost/Pcat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//photo
const uploadDir = 'public/uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.post('/photos', async (req, res) => {
  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name;
  uploadeImage.mv(uploadPath, async () => {
  
  await Photo.create({
    ...req.body,
    image: '/uploads/' + uploadeImage.name,
  });
  res.redirect('/');
});
});


//router
app.get('/', async (req, res) => {
  const photo=await Photo.find({});

  res.render("index",{
    photo:photo
  })
})
app.get('/about', (req, res) => {
  res.render("about")
})
app.get('/add', (req, res) => {
  res.render("add")
})
app.post("/photos", async (req, res) => {
  await Photo.create(req.body)
  res.render("add")
})
app.get("/photos/:id",async (req,res)=>{
  const photo=await Photo.findById(req.params.id)
  res.render("photo",{photo:photo})
})
app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', {
    photo,
  });
});


app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title
  photo.description = req.body.description
  photo.save()

  res.redirect(`/photos/${req.params.id}`)
});


app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/public' + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
});


const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});