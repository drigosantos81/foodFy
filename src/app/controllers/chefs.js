const Intl = require('intl');

const Chefs = require('../models/Chefs');
const Files = require('../models/Files');
const { date } = require('../../lib/utils');

module.exports = {
    async index(req, res) {
        try {
            let results = await Chefs.all();
            const chefs = results.rows;

            if (!chefs) {
                return res.send('Nenhum registro encontrado');
            }

            async function getImage(chefId) {
                let results = await Chefs.chefsFiles(chefId);
                const files = results.rows.map(file => 
                    `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
                );

                return files[0];
            }

            const filesPromise = chefs.map(async chef => {
                chef.img = await getImage(chef.id);
                return chef;
            });
            
            const allChefs = await Promise.all(filesPromise);

            console.log(allChefs);
            console.log(filesPromise);

            return res.render('admin/chefs/index', { chefs: allChefs });
        } catch (error) {
                console.log(error);
        }
    },

    async indexChefs(req, res) {
        try {
            let results = await Chefs.all();
            const chefs = results.rows;
            
            return res.render('admin/chefs/index', { chefs });
        } catch (error) {
            console.log(error);
        }
        // VERSÃO ANTERIOR COM CALBACK
        // Chefs.all(function(chefs) {
        //     return res.render("admin/chefs/index", { chefs });
        // });
    },

    createChef(req, res) {
        return res.render("admin/chefs/criar");
    },

    async postChefs(req, res) {
        try {
            const keys = Object.keys(req.body);

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send("Por favor, preencha todos os campos.");
                }
            }
    
            if (req.files.length == 0) {
                return res.send("Por favor, envie uma imagem.");
            }

            // =============== OPÇÃO 3 =================================            
            const chefFilePromise = req.files.map(async (chefFile) => {
                let chefFileResult = await Files.createFile({ ...chefFile });
                const fileId = chefFileResult.rows[0].id;
                
                // await Chefs.post( { ...file, name, created_at , file_id: fileId } );
                // const chefId = results.rows[0].id;

                // let results = await Chefs.post({ ...file, chefName, file_id: fileId});
                let results = await Chefs.post(req.body, { file_id: fileId });
                const chefId = results.rows[0].id;

                console.log('"id" do files.id: ', fileId);
                console.log('"id" do chefs.id: ', chefId);
                return chefId;
            });

            const imageChef = await Promise.all(chefFilePromise).then((value => {
                console.log('console.log do "Promise.all": ', value);
            }));

            console.log('Resultado do "return" do "chefFilePromise": ', chefFilePromise);
            console.log('Resultado do "return" do "chefFilePromise": ', imageChef);

            // const chefId = chefFilePromise;
            const chefId = imageChef;

            console.log('Resultado da variável que guarda o chefFilePromise: ', chefId);
            // let results = await Chefs.post(req.body, {file_id: chefFilePromise});
            // const chefId = results.rows[0].id;
    
            // let chefId = req.body;
            // let results = await Chefs.post(req.body, {file_id: fileId});
            
            return res.render(`/admin/chefs/chef/${chefId}`);
        } catch (error) {
            console.log(error);
        }

        // =============== OPÇÃO 1 =================================
        // let fileChef = await Files.createFile({ ...files });
        // const fileId = fileChef.rows[0];

        // let results = await Chefs.post(req.body, {file_id: fileId});
        // const chefId = results.rows[0].id;

        // =============== OPÇÃO 2 =================================
        // const chefFilePromise = req.files.map(chefFile => Files.createFile({
        //     ...chefFile,
        //     chef_id: chefId
        // }));

        // await Promise.all(chefFilePromise);
        
        // let results = await Chefs.post(req.body, { file_id: fileId });
        // const chefId = results.rows[0].id;
        
        // =============== VERSÃO ANTERIOR COM CALLBACK =================================
        // Chefs.post(req.body, function(chef) {
        //     return res.redirect(`/admin/chefs/chef/${chef.id}`);
        // });
    },

    exibeChef(req, res) {
        Chefs.find(req.params.id, function(chef) {
            if (!chef) {
                return res.send('Chef não encontrado');
            }

            chef.created_at = date(chef.created_at).format;

            Chefs.recipesFromChefs(req.params.id, function(recipes) {
                return res.render('admin/chefs/chef', { chef, recipes });
            });

            
        });
    },

    editaChef(req, res) {
        Chefs.find(req.params.id, function(chef) {
            if (!chef) {
                return res.send('Chef não cadastrado ou não encontrado.');
            }

            chef.created_at = date(chef.created_at).format;

            return res.render('admin/chefs/editar', { chef });
        });
    },

    putChef(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Preencha todos os campos.');
            }
        }

        Chefs.update(req.body, function() {
            return res.redirect(`/admin/chefs/chef/${req.body.id}`);
        });
    },

    deletaChef(req, res) {
        Chefs.delete(req.body.id, function() {
            return res.redirect('/admin/chefs');
        });
    }
}

// exports.notFound = function(req, res) {
//     res.status(404).render("/frontend/not-found");
// };