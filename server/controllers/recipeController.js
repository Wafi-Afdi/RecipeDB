require('../models/database')
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

exports.homepage = async(req, res) => {

    try{
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
        const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
        const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);
        const food = {latest, thai, american, chinese}
        res.render('index', { title: "Homepage", categories: categories, food});
    } catch (err) {
        res.status(500).send({message: err.message || "Error Occured"});
    }
}

// get categories
exports.exploreCategories = async(req, res) => {

    try{
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        


        res.render('categories', { title: "Categories", categories});
    } catch (err) {
        res.status(500).send({message: err.message || "Error Occured"});
    }
}


//get recipe 
exports.exploreRecipe = async(req, res) => {

    try{
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);


        res.render('recipe', { title: `${recipe.name}`, recipe});
    } catch (err) {
        res.status(500).send({message: err.message || "Error Occured"});
    }
}

// get category by id
exports.exploreCategoriyById = async(req, res) => {

  try{

      let categoryId = req.params.id;


      const limitNumber = 20;
      const categoryById = await Recipe.find({'category': categoryId}).limit(limitNumber);
      


      res.render('categories', { title: "Categories", categoryById});
  } catch (err) {
      res.status(500).send({message: err.message || "Error Occured"});
  }
}

// search recipe(POST) /search
exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Search', recipe })
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured"});
  }
  
}


// explore latest (GET) /explore-latest
exports.exploreLatest = async(req, res) => {
  try {
    const limitShow = 20;
    let recipe = await Recipe.find({}).sort({_id: -1}).limit(limitShow);
    res.render('explore-latest', { title: 'Explore Latest', recipe })
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured"});
  }
  
}

// show random (GET) /show-random
exports.showRandom = async(req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('show-random', { title: 'Explore Random', recipe })
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured"});
  }
  
}

// submit recipe(GET) /submit-recipe
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit')
  try {
    res.render('submit-recipe', { title: 'Submit Recipe', infoErrorsObj, infoSubmitObj})
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured"});
  }
  
}

// submit recipe(POST) /submit-recipe
exports.submitRecipeOnPost = async(req, res) => {
  try {
    let imageUploadFiles;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0) {
      console.log('No files were uploaded');
    } else {
      imageUploadFiles = req.files.image;
      newImageName = Date.now() + imageUploadFiles.name;
      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFiles.mv(uploadPath, function(err){
        if(err) return res.status(500).send(err);
      })
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingridients: req.body.ingridients,
      category: req.body.category,
      image: newImageName,

    })

    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added')
    res.redirect('/submit-recipe')
  } catch (error) {
    req.flash('infoErrors', error)
  }

}
