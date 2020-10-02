const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
    all() {
        return db.query(`
            SELECT * FROM chefs
            ORDER BY chefs.updated_at ASC
        `);
    },
// ORDER BY created_at DESC
    chefFile(id) {
        return db.query(`
            SELECT files.*, chefs.* FROM files
            LEFT JOIN chefs ON (files.id = chefs.file_id)
            WHERE chefs.id = $1        
        `, [id]);
    },

    post(data, file_id) {
        const query = `
            INSERT INTO chefs (name, created_at, file_id)
            VALUES ($1, $2, $3)
            RETURNING id
        `;

        const values = [
            data.name,
            date(Date.now()).iso,
            file_id
        ]

        return db.query(query, values);
    },

    showChef(id) {
        return db.query(`
            SELECT chefs.*, COUNT(recipes) AS total_recipes FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1
            GROUP BY chefs.id        
        `, [id]);
    },

    // SELECT chefs.*, files.*, COUNT(recipes) AS total_recipes FROM chefs
    //         LEFT JOIN files ON (files.id = chefs.file_id)
    //         LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
    //         LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
    //         WHERE chefs.id = $1
    //         GROUP BY chefs.id, files.id


    chefSelector() {
        return db.query(`
            SELECT name, id FROM chefs
        `);
    },

    recipesFromChefs(id) {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.chef_id = $1
        `, [id]);
    },

    filesRecipesFromChef(id) {
        return db.query(`
            SELECT files.*, recipe_files.* FROM files
            LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
            LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
        `, [id]);
    },

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
    
    delete(id) {
        return db.query(`
            DELETE FROM chefs
            WHERE id = $1
        `, [id]);
    }
}