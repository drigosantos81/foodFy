const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
    all() {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY recipes.created_at DESC
        `);
    },    
    allOld(callback) {
        db.query(`
            SELECT recipes.*, chefs.name AS chef_name FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY recipes.title
            `, function(err, results) {
            if (err) {
                throw `Database error! ${err}`;
            }

            callback(results.rows);
        });
    },
    post(data) {
        const query = `
            INSERT INTO recipes (chef_id, title, ingredients, preparation, information, created_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;

        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        return db.query(query, values);
    },
    find(id) {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1
        `, [id]
        );
    },
    files(id) {
        return db.query(`
            SELECT files.*, recipe_files.* FROM files
            LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
            LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
            WHERE recipes.id = $1
        `, [id]);
    },
    update(data) {
        const query = (`
            UPDATE recipes SET
            chef_id=($1), title=($2), ingredients=($3), preparation=($4), information=($5)
            WHERE id = $6
        `);

        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        return db.query(query, values);
    },
    delete(id, callback) {
        db.query(`
            DELETE FROM recipes 
            WHERE id = $1`, [id], function(err, results) {
            if (err) {
                throw `Database error! ${err}`;
            }

            return callback();
        })
    }
}