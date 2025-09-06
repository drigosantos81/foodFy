const faker = require('faker');
const { hash } = require('bcryptjs');
const crypto = require('crypto');

faker.locale = 'pt_BR';

const User = require('./src/app/models/User');
const Recipes = require('./src/app/models/Recipes');
const Chefs = require('./src/app/models/Chefs');
const Files = require('./src/app/models/Files');

let usersIds = [];
let totalRecipes = 5;
let totalUsers = 3;

async function createRecipes() {
  // RECEITAS
  let recipes = [];

  while (recipes.length < totalRecipes) {
    recipes.push({
      chef_id: Math.ceil(Math.random() * 5),
      user_id: usersIds[Math.floor(Math.random() * 4)],      
      title: faker.commerce.product(),
      ingredients: [faker.lorem.lines(Math.ceil(Math.random() * 1))],
      preparation: [faker.lorem.lines(1)],
      information: faker.lorem.paragraph(Math.ceil(Math.random * 1))
    });
  }
  const recipesPromise = recipes.map(recipe => Recipes.post(recipe));

  recipesIds = await Promise.all(recipesPromise);
  
  // FILES
  let files = [];

  while (files.length < 8) {
    files.push({
      name: faker.image.image(),
      path: `img/imagesUploaded/placeholder.png`,
    });
  }
  const filesPromise = files.map(file => Files.createFile(file));

  await Promise.all(filesPromise);

  //RECIPE FILES
  let recipeFiles = [];

  while (recipeFiles < totalRecipes) {
    recipeFiles.push({
      recipe_id: faker.random.number(Math.random() * 6),
      file_id: faker.random.number(Math.random() * 6)
    });
  }
  const recipeFilePromise = recipeFiles.map(recipeFile => Files.createRecipeFile(recipeFiles));

  await Promise.all(recipeFilePromise);
}

async function init() {
  await createRecipes();
}

init();