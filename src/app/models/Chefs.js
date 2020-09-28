const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
    all() {
        return db.query(`
            SELECT * FROM chefs
            ORDER BY created_at DESC
        `);
    },
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

    async showChef(id) {
        return db.query(`
            SELECT chefs.*, COUNT(recipes) AS total_recipes FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1
            GROUP BY chefs.id
        `, [id]);
    },
    
    chefSelector() {
        return db.query(`
            SELECT name, id FROM chefs
        `);
    },

    async recipesFromChefs(id, callback) {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.chef_id = $1
        `, [id]);
        // db.query(`
        //     SELECT recipes.*, chefs.name AS chef_name FROM recipes
        //     LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        //     WHERE recipes.chef_id = $1
        // `, [id], function(err, results) {
        //     if (err) {
        //         throw `Databse error! ${err}`;
        //     }

        //     callback(results.rows);
        // });
    },

    update(data, callback) {
        const query = `
            UPDATE chefs SET
            name=($1), avatar_url=($2)
            WHERE id = $3
        `;

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if (err) {
                throw `Database error! ${err}`;
            }

            callback();
        });
    },

    delete(id, callback) {
        db.query(`
            DELETE FROM chefs
            WHERE id = $1
        `, [id], function(err, results) {
            if (err) {
                throw `Database error! ${err}`;
            }

            return callback();
        });
    }
}