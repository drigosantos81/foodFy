const db = require('../../config/db');
const { age, date, birthDay } = require('../../lib/utils');

module.exports = {

    // ===================== RECIPES =====================

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

    post(data, callback) {
        const query = `
            INSERT INTO recipes (chef_id, image, title, ingredients, preparation, information, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;

        const values = [
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        db.query(query, values, function(err, results) {
            if (err) {
                throw `Problemas com o Banco de Dados. ${err}`
            }

            callback(results.rows[0]);
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

    // ===================== CHEFS =====================

    allChefs(callback) {
        db.query(`
            SELECT * FROM chefs
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
    }

}
    
    // update(data, callback) {
    //     const query = `
    //         UPDATE instructors SET
    //         avatar_url=($1), name=($2), birth=($3), gender=($4), services=($5)
    //         WHERE id = $6
    //     `;

    //     const values = [
    //         data.avatar_url,
    //         data.name,
    //         date(data.birth).iso,
    //         data.gender,
    //         data.services,
    //         data.id
    //     ]

    //     db.query(query, values, function(err, results) {
    //         if (err) {
    //             throw `Database error! ${err}`;
    //         }

    //         callback();
    //     });
    // },


    // findBy(filter, callback) {
    //     db.query(`
    //         SELECT instructors.*, COUNT(members) AS TOTAL_STUDENTS FROM instructors
    //         LEFT JOIN members ON (members.instructor_id = instructors.id)
    //         WHERE instructors.name ILIKE '%${filter}%'
    //         OR instructors.services ILIKE '%${filter}%'
    //         GROUP BY instructors.id
    //         ORDER BY total_students DESC
    //         `, function(err, results) {
    //         if (err) {
    //             throw `Database error! ${err}`;
    //         }
                
    //         callback(results.rows);
    //     });
    // },

    // delete(id, callback) {
    //     db.query(`
    //         DELETE FROM instructors 
    //         WHERE id = $1`, [id], function(err, results) {
    //         if (err) {
    //             throw `Database error! ${err}`;
    //         }

    //         return callback();
    //     })
    // },

    // paginate(params) {
    //     const { filter, limit, offset , callback } = params;

    //     let query = '',
    //         filterQuery = '',
    //         totalQuery = `(
    //             SELECT COUNT(*) FROM instructors
    //         ) AS total`

    //     if (filter) {
    //         filterQuery = `
    //         WHERE instructors.name ILIKE '%${filter}%'
    //         OR instructors.services ILIKE '%${filter}%'`

    //         totalQuery = `(
    //             SELECT COUNT(*) FROM instructors
    //             ${filterQuery}
    //         ) AS total`
    //     }

    //     query = `
    //         SELECT instructors.*, ${totalQuery}, COUNT(members) AS total_students FROM instructors
    //         LEFT JOIN members ON (instructors.id = members.instructor_id)
    //         ${filterQuery}
    //         GROUP BY instructors.id LIMIT $1 OFFSET $2`
        
    //     db.query(query, [limit, offset], function(err, results) {
    //         if (err) {
    //             throw `Database error! ${err}`;
    //         }

    // //         callback(results.rows);
    //     });
    // }
