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
    },
	
	findBy(filter, callback) {
		db.query(`
            SELECT recipes.*, chefs.name AS chef_name FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.title ILIKE '%${filter}%'
		`, function(err, results) {
			if (err) {
				throw `Database error! ${err}`;
			}
			
			callback(results.rows);			
        });
	}
}


    
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
    