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

async function insertDymmyRecipeData(){
  try {
    await Recipe.insertMany([
      { 
        "name": "Recipe Name Goes Here",
        "description": `Recipe Description Goes Here`,
        "email": "recipeemail@raddy.co.uk",
        "ingridients": [
          "1 level teaspoon baking powder"
],
        "category": "American", 
        "image": "southern-friend-chicken.jpg"
      }
    ]);
  } catch (error) {
    console.log('err', + error)
  }
}

insertDymmyRecipeData();
