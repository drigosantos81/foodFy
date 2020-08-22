const db = require('../../config/db');
const { age, date, birthDay } = require('../../lib/utils');

module.exports = {
    all(callback) {
        db.query(`
            SELECT * FROM chefs
            ORDER BY name
        `, function(err, results) {
            if (err) {
                throw `Database error! ${err}`;
            }

            callback(results.rows);
        });
    },

    post(data, callback) {
        const query = `
            INSERT INTO chefs (name, avatar_url, created_at)
            VALUES ($1, $2, $3)
            RETURNING id
        `;

        const values = [
            data.name,
            data.avatar_url,
            date(Date.now()).iso
        ]

        db.query(query, values, function(err, results) {
            if (err) {
                throw `Database error! ${err}`;
            }

            callback(results.rows[0]);
        });
    },

    find(id, callback) {
        db.query(`
            SELECT chefs.*, COUNT(recipes) AS total_recipes FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1
            GROUP BY chefs.id
        `, [id], function(err, results) {
            if (err) {
                throw `Database error! ${err}`;
            }

            callback(results.rows[0]);
        });
    },
    
    chefSelector() {
        return db.query(`
            SELECT name, id FROM chefs
        `);
        // db.query(`
        //     SELECT name, id FROM chefs
        // `, function(err, results) {
        //     if (err) {
        //         throw `Database error! ${err}`;
        //     }

        //     callback(results.rows);
        // });
    },

    recipesFromChefs(id, callback) {
        db.query(`
            SELECT recipes.*, chefs.name AS chef_name FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.chef_id = $1
        `, [id], function(err, results) {
            if (err) {
                throw `Databse error! ${err}`;
            }

            callback(results.rows);
        });
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