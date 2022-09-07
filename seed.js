const { hash } = require('bcryptjs');
const crypto = require('crypto');
const faker = require('faker');

faker.locale = 'pt_BR';

const User = require('./src/app/models/User');
const Chefs = require('./src/app/models/Chefs');
const Recipes = require('./src/app/models/Recipes');
const Files = require('./src/app/models/Files');

let usersIds = [];
let totalUsers = 5;
let totalChefs = 6;
let totalRecipes = 5;
let totalFiles = 6;
let totalFilesRecipes = 10;

async function createUsers() {
  const users = [];
  const password = await hash('1111', 8);
  const token = await crypto.randomBytes(8).toString('hex');
  
  let nowToken = new Date(); // Expiração do Token
  nowToken = nowToken.setHours(nowToken.getHours() + 1);

  while (users.length < totalUsers) {
    users.push({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password,
      token,
      nowToken,
      is_admin: faker.random.boolean(),
    });
  }

  const userPromise = users.map(user => User.post(user));

  usersIds = await Promise.all(userPromise);
}

async function createFiles() {
  let files = [];
  
  while (files.length < 6) {
    files.push({
      name: faker.name.findName(),
      path: `img/imagesUploaded/placeholder.png`,
      // chef_id: Math.floor(Math.random() * totalChefs)
      // chef_id: chefsIds[Math.floor(Math.random() * totalChefs)]
    });
  }
  const filesPromise = files.map(file => Files.createFile(file));

  fileId = await Promise.all(filesPromise);
}

async function createChefs() {
  let files = [];
  
  while (files.length < totalFiles) {
    files.push({
      name: faker.name.findName(),
      path: `img/imagesUploaded/placeholder.png`
    });
  }
  const filesPromise = files.map(file => Files.createFile(file));

  fileId = await Promise.all(filesPromise);

  let chefs = [];  

  while (chefs.length < totalChefs) {
    chefs.push({
      name: faker.name.findName(),
      // file_id: faker.random.number(Math.random() * totalChefs),
      file_id: fileId[faker.random.number(Math.random() * 6)]
      // faker.random.number(Math.random() * 54)
    });
  }  
  const chefPromise = chefs.map(chef => Chefs.post(chef));
  
  /*chefsIds = */await Promise.all(chefPromise);
  console.log('CHEF COMPLETO: ', chefPromise);
}

async function createRecipes() {
  // Tabela recipes
  let recipes = [];
  
  while (recipes.length < totalRecipes) {
    recipes.push({
      chef_id: Math.ceil(Math.random() * 5),
      user_id: usersIds[Math.floor(Math.random() * totalUsers)],      
      title: faker.commerce.product(),
      ingredients: [faker.random.word(), faker.random.word(), faker.random.word()],
      preparation: [faker.random.word(), faker.random.word(), faker.random.word()],
      information: faker.lorem.words(Math.ceil(Math.random() * 12))
    });
  }
  const recipesPromise = recipes.map(recipe => Recipes.post(recipe));

  recipesIds = await Promise.all(recipesPromise);

   // Tabela files
   let files = [];
  
   while (files.length < 6) {
     files.push({
       name: faker.image.image(),
       path: `img/imagesUploaded/placeholder.png`
     });
   }
   const filesPromise = files.map(file => Files.createFile(file));
 
   fileId = await Promise.all(filesPromise);
 
  
  // Tabela recipe_files
  let recipeFiles = [];

  while (recipeFiles.length < 50) {
    recipeFiles.push({
      recipe_id: recipesIds[Math.floor(Math.random() * totalFilesRecipes)],
      file_id: fileId[Math.floor(Math.random() * totalFilesRecipes)]
    });
  }
  const recipeFilesPromise = recipeFiles.map(recipeFile => Files.createRecipeFile(recipeFile));

  await Promise.all(recipeFilesPromise);
}

async function init() {
  // await createUsers();
  // await createFiles();
  await createChefs();
  // await createRecipes();
}

init();