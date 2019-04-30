require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT
const Fruit = require('./models/fruit');
const ejs = require('ejs');
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const Smoothie = require('./models/smoothie');

mongoose.connect('mongodb://localhost/fruits', {useNewUrlParser : true})
.then(()=> console.log('Mongodb is running'),(err)=> console.log(err) )

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));
app.use(methodOverride('_method'));

//SMOOTHIE INDEX
app.get('/smoothies', (req, res) => {
  Smoothie.find()
  .sort('-createdAt')
  .populate({ path: 'fruits', select: 'name' })
    .then(smoothies => {
      res.render('smoothies/index', { smoothies })
    })
})

// smooties new 
app.get('/smoothies/new', (req, res) => {
  Fruit.find()
    .then(fruits => {
      res.render('smoothies/new', { fruits })
    })
})
//smoothie post 
app.post('/smoothies', (req, res) => {
  let newSmoothie = new Smoothie(req.body)
if (!Array.isArray(req.body.smoothieFruitsArray)){
  newSmoothie.fruits.push(req.body.smoothieFruitsArray)
}else{
  req.body.smoothieFruitsArray.forEach(fruit => {
    newSmoothie.fruits.push(fruit)
  })
}
  newSmoothie.save()
  res.redirect('/smoothies');
})
//smoothie SHOW
app.get('/smoothies/:index', (req, res) => {
  Smoothie.findById(req.params.index)
  .populate({ path: 'fruits', select: 'name' })
  .then((smoothie)=>{
    res.render('smoothies/show', {smoothie})
  })
})

// smoothie EDIT
app.get('/smoothies/:index/edit', (req, res) => {
  let fruits= []
   Fruit.find()
  .then(f => {
    fruits= f
  })
  Smoothie.findById(req.params.index)
    .then(smoothie => {
      res.render('smoothies/edit', { smoothie,fruits }) //Fruit.find()
    })
})

// smoothie DELETE
app.delete('/smoothies/:index', (req, res) => {
  Smoothie.findByIdAndDelete(req.params.index)
    .then(() => {
      res.redirect('/smoothies');
    })
})

//smoothie PUT
app.put('/smoothies/:index', (req, res) => {
  let updated = req.body
  Smoothie.findByIdAndUpdate(req.params.index, updated)
    .then(smoothie => {
      res.redirect(`/smoothies/${smoothie._id}`);
    })
})

/////////////////////
//INDEX
app.get('/fruits', (req, res) => {
  
  Fruit.find()
  .then((fruits)=>{
    res.render('index', { fruits })
  }).catch(err => console.log(err))

})

//NEW
app.get('/fruits/new', (req, res) => {
  res.render('new')
})

//POST
app.post('/fruits', (req, res) => {

  let data = {
    name: req.body.name, 
    color: req.body.color
  }

  if (req.body.readyToEat === 'on') { // if checked, req.body.readyToEat is set to 'on'
    data.readyToEat = true
  } else { // if not checked, req.body.readyToEat is undefined
    data.readyToEat = false
  }

  let fruit = new Fruit(data)
  fruit.save()
  .then(()=> {
    res.redirect('/fruits')
  }).catch(err => console.log(err))

  
})

//SHOW
app.get('/fruits/:indexOfFruitsArray', (req, res) => {
  Fruit.findById(req.params.indexOfFruitsArray)
  .then((fruit)=>{
    res.render('show', {
      fruit: fruit
    })
  })
})

//EDIT
app.get('/fruits/:indexOfFruitsArray/edit', (req, res) => {
  Fruit.findById(req.params.indexOfFruitsArray)
    .then(fruit => {
      res.render('edit', { fruit })
    })
})

//DELETE
app.delete('/fruits/:indexOfFruitsArray', (req, res) => {
  Fruit.findByIdAndDelete(req.params.indexOfFruitsArray)
    .then(() => {
      res.redirect('/fruits');
    })
})

//PUT
app.put('/fruits/:indexOfFruitsArray', (req, res) => {
  let updatedFruit = req.body
  updatedFruit.readyToEat = req.body.readyToEat === 'on' ? true : false
 
  Fruit.findByIdAndUpdate(req.params.indexOfFruitsArray, updatedFruit)
    .then(fruit => {
      res.redirect(`/fruits/${fruit._id}`);
    })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})