const Recipes = require('../models/Recipes');
const Chefs = require('../models/Chefs');
const Files = require('../models/Files');
const User = require('../models/User');
const { date } = require('../../lib/utils');

module.exports = {
  // RETORNA TODAS AS RECEITAS
  async index(req, res) {
    try {
      let resultesSessionId = await User.userLogged(req.session.userId);
      const userLoggedId = resultesSessionId.rows[0].id;
      const userLogged = resultesSessionId.rows[0].name;

      let { success, error } = req.session;
      req.session.success = "", req.session.error = "";

      // Retorna todos os dados da Receita
      let results = await Recipes.all();
      const recipes = results.rows;

      const user = req.session.userId;

      if (!recipes) {
        return res.send('Receita não encontrada');
      }
      
      // Retorna todas as imagens da Receita
      async function getImage(recipeId) {
        let results = await Recipes.files(recipeId);
        const files = results.rows.map(file => 
          `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
        );

        return files[0];
      }

      const filesPromise = recipes.map(async recipe => {
        recipe.img = await getImage(recipe.id);
        return recipe;
      });

      const allRecipe = await Promise.all(filesPromise);

      console.log('SESSION ID: ', resultesSessionId);

      return res.render('admin/recipes/index', { userLogged, userLoggedId, recipes: allRecipe, user, success, error });

    } catch (error) {
      console.log(error);
    }
  },

  // RETORNA A LISTA DOS NOMES DOS CHEFS PARA VINCULAR A RECEITA
  async create(req, res) {
    let resultesSessionId = await User.userLogged(req.session.userId);
    const userLoggedId = resultesSessionId.rows[0].id;
    const userLogged = resultesSessionId.rows[0].name;

    let { success, error } = req.session;
    req.session.success = "", req.session.error = "";

    console.log('REQ.BODY: ', req.body);

    let results = await Chefs.chefSelector();
    const chefName = results.rows;

    const user = req.session.userId;

    return res.render('admin/recipes/criar', { userLogged, userLoggedId, chefName, user, success, error });
  },

  // COMANDO POST PARA NOVA RECEITA
  async post(req, res) {
    try {
      // const keys = Object.keys(req.body);

      // for (key of keys) {
      //   if (req.body[key] == "") {
      //     return res.send("Por favor, preencha todos os campos.");
      //   }
      // }

      if (req.files.length == 0) {
        req.session.error = 'Envie pelo menos uma imagem.'
        // return res.send("Por favor, envie pelo menos uma imagem.");
      }

      req.body.user_id = req.session.userId;

      // Post da Receita com todos os campos preenchidos
      let results = await Recipes.post(req.body);
      const recipeId = results.rows[0].id;

      const filesPromise = req.files.map(async (fileRecipe, file) => {
        let fileResults = await Files.createFile({ ...fileRecipe });
        const fileId = fileResults.rows[0].id;
        Files.createRecipeFile({ ...file, recipe_id: recipeId, file_id: fileId });
      });
      await Promise.all(filesPromise);

      req.session.success = 'Nova receita salva com sucesso.';
        
      return res.redirect(`/admin/recipes/recipe/${recipeId}`);

    } catch (error) {
        console.error(error);
        req.session.error = 'Erro inesperado, tente novamente.'
      return res.redirect(`/admin/recipes/criar`);
    }
  },

  // RETORNA AS INFORMAÇÕES DE UMA RECEITA
  async exibe(req, res) {
    try {
      // Dados do usuário logado
      let resultesSessionId = await User.userLogged(req.session.userId);
      const userLoggedId = resultesSessionId.rows[0].id;
      const userLogged = resultesSessionId.rows[0].name;

      // Mensagens de Sucesso ou Erro após os POSTs, UPDATEs e DELETEs
      let { success, error } = req.session;
      req.session.success = "", req.session.error = "";

      let results = await Recipes.find(req.params.id);
      const recipe = results.rows[0];

      const user = req.session.userId;

      if (!recipe) {
        return res.send('Receita não encontrada');
      }

      // Formatação das datas
      recipe.created_at = date(recipe.created_at).format;

      const { year, month, day } = date(recipe.updated_at);

      recipe.published = {
        year,
        month,
        day: `${day}/${month}/${year}`
      }
      
      recipe.updated_at = date(recipe.updated_at).format;
      
      // Retorna imagens(arquivo)
      results = await Recipes.files(recipe.id);
      let files = results.rows.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
      }));

      return res.render('admin/recipes/recipe', { userLogged, userLoggedId, recipe, files, user, success, error });

    } catch (error) {
      console.log(error);
    }
  },

  // RETORNA OS DADOS DE TODOS OS CAMPOS DA RECEITA SELECIONADA PARA EDIÇÃO
  async edita(req, res) {
    try {
      // Dados do usuário logado
      let resultesSessionId = await User.userLogged(req.session.userId);
      const userLoggedId = resultesSessionId.rows[0].id;
      const userLogged = resultesSessionId.rows[0].name;

      // Mensagens de Sucesso ou Erro após os POSTs, UPDATEs e DELETEs
      let results = await Recipes.find(req.params.id);
      const recipe = results.rows[0];

      console.log('REQ.PARAMS: ', req.params);
      console.log('REQ.BODY: ', req.body);

      const user = req.session.userId;

      if (!recipe) {
        return res.send('Receita não encontrada');
      }

      // Retorna lista dos nome dos Chefs para vincular a Receita
      results = await Chefs.chefSelector();
      const chefName = results.rows;

      // Retorna imagens(arquivo)
      results = await Recipes.files(recipe.id);
      let files = results.rows.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
      }));
      
      return res.render('admin/recipes/editar', { userLogged, userLoggedId, recipe, chefName, files, user });

    } catch (error) {
      console.log(error);
    }        
  },

  // COMANDO PUT PARA ATUALIZAÇÃO DE UMA RECEITA
  async putRecipe(req, res) {
    try {
      const keys = Object.keys(req.body);

      for (key of keys) {
        if (req.body[key] == "" && key != "removed_files") {
          return res.send("Por favor, preencha todos os campos.");
        }
      }
      // VALIDAÇÃO E REMOÇÃO DAS IMAGENS NO BANCO (BackEnd)
      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(",");
        const lastIndex = removedFiles.length - 1;
        removedFiles.splice(lastIndex, 1);
        
        const removedFilesPromise = removedFiles.map(async (idFile) => {
          let fileRecipeRemoved = await Recipes.fileRecipeRemoved(idFile);
          
          Files.deleteRecipeFile(idFile);

          let idFileRecipeRemoved = fileRecipeRemoved.rows[0].id;
          
          await Recipes.updateRecipeFilesFileId(idFile);
          
          Files.deleteFile(idFileRecipeRemoved);
        });

        await Promise.all(removedFilesPromise);
      }

        // VERIFICAÇÃO SE EXISTE IMAGENS
      if (req.files.length != 0) {
        const oldFiles = await Recipes.files(req.body.id);
        const totalFiles = oldFiles.rows.length + req.files.length;

        // VERIFICAÇÃO SE TEM ATÉ 5 IMAGENS
        if (totalFiles <= 5) {                    
          const newFilesPromise = req.files.map(async (fileRecipe, file) => {
            let fileResults = await Files.createFile({ ...fileRecipe });
            const fileId = fileResults.rows[0].id;
            Files.createRecipeFile({ ...file, recipe_id: req.body.id, file_id: fileId });
          });
          await Promise.all(newFilesPromise);
        }
      }
        
      await Recipes.update(req.body);

      req.session.success = 'Receita atualizada com sucesso.';
      
      return res.redirect(`/admin/recipes/recipe/${req.body.id}`);

    } catch (error) {
      console.error(error);
      req.session.error = 'Erro inesperado, tente novamente.'
      return res.redirect(`/admin/recipes/recipe/${req.body.id}`);
    }
  },

  // COMANDO DELETE PARA EXCLUSÃO DE UMA RECEITA
  async deleteRecipe(req, res) {
    try {
      await Files.deleteRecipeFile(req.body.id);

      await Recipes.delete(req.body.id);

      req.session.success = 'Receita excluída do FoodFy com sucesso.';

      return res.redirect('/admin/recipes');

    } catch (error) {
      console.error(error);
      req.session.error = 'Erro inesperado, tente novamente.'
      return res.redirect(`/admin/recipes`);
    }
  },

  // PÁGINA NÃO ENCONTRADA
  notFound(req, res) {
    res.status(404).render("admin/recipes/not-found");
  }
}