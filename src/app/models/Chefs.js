const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
    // Retorna os dados de todos os Chefs
    all() {
        return db.query(`
            SELECT chefs.*, COUNT(recipes) AS total_recipes FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            GROUP BY chefs.id
            ORDER BY chefs.updated_at ASC
        `);
    },
    // Retorna a imagem de um Chef
    chefFile(id) {
        return db.query(`
            SELECT files.* FROM files
            LEFT JOIN chefs ON (files.id = chefs.file_id)
            WHERE chefs.id = $1
        `, [id]);
    },
    // Salva novo registro de um Chef
    post(data, file_id) {
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
        ]

        return db.query(query, values);
    },
    // Retorna o dados de um Chef
    showChef(id) {
        return db.query(`
            SELECT chefs.*, COUNT(recipes) AS total_recipes FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1
            GROUP BY chefs.id
        `, [id]);
    },
    // Retorna o nome de todos os Chefs
    chefSelector() {
        return db.query(`
            SELECT name, id FROM chefs
            ORDER BY name ASC
        `);
    },
    // Retorna todas as receitas de um Chef
    recipesFromChefs(id) {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.chef_id = $1
        `, [id]);
    },
    // Retorna todas as imagens das receitas de um Chef
    filesRecipesFromChef(id) {
        return db.query(`
            SELECT files.*, recipe_files.* FROM files
            LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
            LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            WHERE recipes.id = $1
        `, [id]);
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
    },
    // Deleta um registro da tabela chefs
    delete(id) {
        return db.query(`
            DELETE FROM chefs
            WHERE id = $1
        `, [id]);
    }
}