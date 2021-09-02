const Recipes = require('../models/Recipes');
const { date } = require('../../lib/utils');

async function getImages(recipeId) {  
    let files = await Recipes.files(recipeId);
    files = files.map(file => ({
      ...file,
      src: `${file.path.replace('public', '').replace(/\\/g, "/" )}`
    }));

  return files;
}

async function format(recipe) {
  const files = await getImages(recipe.id);
  
  recipe.img = files[0].src;
  recipe.files = files;
    
  const { year, month, day, hour, minutes } = date(recipe.updated_at);

  recipe.published = {
    year,
    month,
    day: `${day}/${month}/${year}`,
    hour: `${hour}:${minutes}h`,
    minutes
  }
  
  return recipe;
};

const LoadService = {
  async load(service, filter) {
    this.filter = filter;
    
    return this[service]()
  },
  async recipe() {
    try {
      const recipe = await Recipes.find(this.filter);

      return format(recipe);

    } catch (error) {
      console.error(error);
    }
  },
  async recipes() {
    try {
      const recipes = await Recipes.all(this.filter);
      const recipesPromise = recipes.rows(format);

      return Promise.all(recipesPromise);

    } catch (error) {
      console.error(error);
    }
  },

  format,
}

module.exports = LoadService;