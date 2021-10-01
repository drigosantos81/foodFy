const { hash } = require('bcryptjs');
const crypto = require('crypto');
const faker = require('faker');

faker.locale = 'pt_BR';

const User = require('./src/app/models/User');
const Chefs = require('./src/app/models/Chefs');
const Files = require('./src/app/models/Files');

let usersIds = [];
let totalUsers = 5;
let totalChefs = 6;

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

  while (products.length < totalProducts) {
    products.push({
      category_id: Math.ceil(Math.random() * 3),
      user_id: usersIds[Math.floor(Math.random() * totalUsers)],
      name: faker.name.title(),
      description: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
      old_price: faker.random.number(9999),
      price: faker.random.number(9999),
      quantity: faker.random.number(99),
      status: Math.round(Math.random())
    });
  }

  const productsPromise = products.map(product => Product.create(product));

  productsIds = await Promise.all(productsPromise);

  let files = [];

  while (files.length < 50) {
    files.push({
      name: faker.image.image(),
      path: `public/images/placeholder.png`,
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