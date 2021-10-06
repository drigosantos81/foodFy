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

async function createChefs() {
  let files = [];
  while (files.length < 6) {
    files.push({
      name: faker.image.image(),
      path: `img/imgChefsUploaded/placeholder.png`
    });
  }
  
  const filesPromise = files.map(file => Files.createFile(file));
    
  fileId = await Promise.all(filesPromise);
  console.log('FILE COMPLETO: ', filesPromise);
  
  let chefs = [];
  // const  = files.map(file => File.create(file));
  while (chefs.length < totalChefs) {
    chefs.push({
      name: faker.name.firstName(),
      file_id: fileId[Math.floor(Math.random() * totalChefs)]
    });
  }
  
  const chefPromise = chefs.map(chef => Chefs.post(chef));
  
  await Promise.all(chefPromise);
  console.log('CHEF COMPLETO: ', chefPromise);
}

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
  await createUsers();
  await createChefs();
  await createRecipes();
}

init();