const express = require('express');
const ejs = require('ejs');
const path=require('path')
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();
const fileUpload = require('express-fileupload');
const Photo = require('./models/Photo')
const fs = require('fs');
const photoController = require('./controllers/photoControllers');
const pageController = require('./controllers/pageController');
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
app.get('/', photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhoto);
app.post('/photos', photoController.createPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);


app.get('/about', pageController.getAboutPage);
app.get('/add', pageController.getAddPage);
app.get('/photos/edit/:id', pageController.getEditPage);


const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});