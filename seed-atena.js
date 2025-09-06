const { hash } = require('bcryptjs');
const crypto = require('crypto');
const faker = require('faker');

faker.locale = 'pt_BR';

const Suscetiveis = require('./src/app/models/Suscetiveis');

let usersIds = [];
let totaSuscetiveis = 5;

async function createSuscetiveis() {
  let suscetiveis = [];
  
  while (suscetiveis.length < totaSuscetiveis) {
    suscetiveis.push({
      dataref: faker.date.recent(),
      acao: [],
      utd: faker.address.cityName(),
      zcgaccoun: faker.datatype.number(999999999999),
      zcgmtvcon: faker.datatype.float(),
      pecld_cons: faker.datatype.float(),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      zona: faker.datatype.number(999),
      zcgmunici: faker.address.cityName(),
      zcglocali: faker.address.cityName(),
      zcgbairro: faker.address.streetAddress(),
      score: faker.datatype.number(2),
      flag_def: [],
      zcgqtftve: faker.datatype.number(2),
      zcgtiploc: faker.datatype.number(2),
    });
  }

  const suscetiveisPromise = suscetiveis.map(suscetivel => Suscetiveis.postSuscetiveis(suscetivel));

  suscetiveis = await Promise.all(suscetiveisPromise);
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
  await createSuscetiveis();
}

init();