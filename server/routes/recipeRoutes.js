const express = require('express')
const router = express.Router();
const recipeController = require('../controllers/recipeController')

router.get('/', recipeController.homepage)
router.get('/categories', recipeController.exploreCategories)
router.get('/recipe/:id', recipeController.exploreRecipe)
router.get('/categories/:id', recipeController.exploreCategoriyById)
router.post('/search', recipeController.searchRecipe)
router.get('/explore-latest', recipeController.exploreLatest)
router.get('/explore-random', recipeController.showRandom)
router.get('/submit-recipe', recipeController.submitRecipe)
router.post('/submit-recipe', recipeController.submitRecipeOnPost)

module.exports = router;