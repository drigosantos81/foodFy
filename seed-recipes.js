const { hash } = require('bcryptjs');
const crypto = require('crypto');
const faker = require('faker');

faker.locale = 'pt_BR';

const User = require('./src/app/models/User');
const Recipes = require('./src/app/models/Recipes');
const Chefs = require('./src/app/models/Chefs');
const Files = require('./src/app/models/Files');

let usersIds = [];
let totalRecipes = 5;

async function createRecipes() {
  let recipes = [];

  while (recipes.length < totalRecipes) {
    recipes.push({
      chef_id: Math.ceil(Math.random() * 5),
      user_id: usersIds[Math.floor(Math.random() * totalUsers)],      
      title: faker.commerce.product(),
      ingredients: faker.lorem.lines(Math.ceil(Math.random() * 1)),
      preparation: faker.lorem.lines(1),
      information: faker.lorem.paragraph(Math.ceil(Math.random * 1))
    });
  }
  const recipesPromise = recipes.map(recipe => Recipes.post(recipe));

  recipesIds = await Promise.all(recipesPromise);
  
  let files = [];

  while (files.length < 50) {
    files.push({
      name: faker.image.image(),
      path: `img/imagesUploaded/placeholder.png`,
      product_id: productsIds[Math.floor(Math.random() * totalProducts)]
    });
  }

  const filesPromise = files.map(file => File.create(file));

  await Promise.all(filesPromise);
}

async function init() {
  await createRecipes();
}

init();