const db = require('../../config/db');
const { age, date, birthDay } = require('../../lib/utils');

module.exports = {

    // ===================== RECIPES =====================

    all(callback) {
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

        // db.query(query, values, function(err, results) {
        //     if (err) {
        //         throw `Problemas com o Banco de Dados. ${err}`
        //     }

        //     callback(results.rows[0]);
        // });
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

    chefSelector(callback) {
        db.query(`
            SELECT name, id FROM chefs
        `, function(err, results) {
            if (err) {
                throw `Database error! ${err}`;
            }

            callback(results.rows);
        });
    },

    updateRecipe(data, callback) {
        const query = (`
            UPDATE recipes SET
            chef_id=($1), image=($2), title=($3), ingredients=($4), preparation=($5), information=($6)
            WHERE id = $7
        `);

        const values = [
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if (err) {
                throw `Problemas com o Banco de Dados. ${err}`
            }

            callback();
        });
    },

    deleteReceita(id, callback) {
        db.query(`
            DELETE FROM recipes 
            WHERE id = $1`, [id], function(err, results) {
            if (err) {
                throw `Database error! ${err}`;
            }

            return callback();
        })
    },

    // ===================== CHEFS =====================

    allChefs(callback) {
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

    postChef(data, callback) {
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

    findChef(id, callback) {
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

    updateChef(data, callback) {
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

    deleteChef(id, callback) {
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
