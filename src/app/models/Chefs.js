const db = require('../../config/db');
const { date } = require('../../lib/utils');
const { post } = require('./User');

module.exports = {
    // Retorna os dados de todos os Chefs
    all() {
        try {
            return db.query(`
                SELECT chefs.*, COUNT(recipes) AS total_recipes FROM chefs
                LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
                GROUP BY chefs.id
                ORDER BY chefs.name ASC
            `);
        } catch (error) {
            console.log(error);
        }
    },
    // Retorna a imagem de um Chef
    chefFile(id) {
        try {
            return db.query(`
                SELECT files.* FROM files
                LEFT JOIN chefs ON (files.id = chefs.file_id)
                WHERE chefs.id = $1
            `, [id]);
        } catch (error) {
            console.log(error);
        }
    },
    // Salva novo registro de um Chef
    post(data, file_id){
        try {
            const query = `
                INSERT INTO chefs (name, file_id, created_at, updated_at)
                VALUES ($1, $2, $3, $4)
                RETURNING id
            `;

            const values = [
                data.name,
                file_id,
                date(Date.now()).iso,
                date(Date.now()).iso
            ];

            return db.query(query, values).then(result => result.rows[0]);
        } catch (error) {
            console.log(error);
        }
    },

    // post(data, file_id) {
    //     try {
    //         const query = `
    //             INSERT INTO chefs (name, file_id, created_at, updated_at)
    //             VALUES ($1, $2, $3, $4)
    //             RETURNING id
    //         `;

    //         const values = [
    //             data.name,
    //             file_id,
    //             date(Date.now()).iso,
    //             date(Date.now()).iso
    //         ]

    //         return db.query(query, values);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // },
    // Retorna o dados de um Chef
    showChef(id) {
        try {
            return db.query(`
                SELECT chefs.*, COUNT(recipes) AS total_recipes FROM chefs
                LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
                WHERE chefs.id = $1
                GROUP BY chefs.id
            `, [id]);
        } catch (error) {
            console.log(error);
        }
    },
    // Retorna o nome de todos os Chefs
    chefSelector() {
        try {
            return db.query(`
                SELECT name, id FROM chefs
                ORDER BY name ASC
            `);
        } catch (error) {
            console.log(error);
        }
    },
    // Retorna todas as receitas de um Chef
    recipesFromChefs(id) {
        try {
            return db.query(`
                SELECT recipes.*, chefs.name AS chef_name FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.chef_id = $1
                ORDER BY recipes.created_at DESC
            `, [id]);
        } catch (error) {
            console.log(error);
        }
    },
    // Retorna todas as imagens das receitas de um Chef
    filesRecipesFromChef(id) {
        try {
            return db.query(`
                SELECT files.*, recipe_files.* FROM files
                LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
                LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
                LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
                WHERE recipes.id = $1
            `, [id]);
        } catch (error) {
            console.log(error);
        }
    },
    // Update da tabela chefs apagando a referência com a tabela files
    async updateChefFileId(id) {
        try {
            return db.query(`
                UPDATE chefs SET
                file_id = null
                WHERE id = $1
            `, [id]);
        } catch (error) {
            console.log(error);
        }
    },
    // Update da tabela chefs
    update(data, file_id) {
        try {
            const query = (`
                UPDATE chefs SET
                name = ($1),
                file_id = ($2)
                WHERE id = $3
            `);

            const values = [
                data.name,
                file_id,
                data.id
            ]

            return db.query(query, values);
        } catch (error) {
            console.log(error);
        }
    },
    // Deleta um registro da tabela chefs
    delete(id) {
        try {
            return db.query(`
                DELETE FROM chefs
                WHERE id = $1
            `, [id]);
        } catch (error) {
            console.log(error);
        }
    }
}