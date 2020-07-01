const db = require('../../config/db');
const { age, date, birthDay } = require('../../lib/utils');

module.exports = {
    all(callback) {
        db.query(`
            SELECT recipes.*, chefs.name AS chef_name FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            `, function(err, results) {
            if (err) {
                throw `Database error! ${err}`;
            }

            callback(results.rows);
        });
    },

    find(id, callback) {
        db.query(`
        SELECT recipes.*, chefs.name AS chef_name FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
        `, [id], function(err, results) {
            if (err) {
                throw `Database error! ${err}`;
            }

            callback(results.rows[0]);
        });
    },

    allChefs(callback) {
        db.query(`
            SELECT * FROM chefs
        `, function(err, results) {
            if (err) {
                throw `Database error! ${err}`;
            }

            callback(results.rows);
        });
    }

}
