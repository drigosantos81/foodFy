const db = require('../../config/db');

module.exports = {
    // ============================== RECIPES ==============================
    allIndex() {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY recipes.updated_at ASC
            LIMIT 6
        `);
    },

    allRecipes() {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY recipes.created_at DESC
        `);
    },

    findSelectedRecipe(id) {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1
        `, [id]);
    },

    findBy(filter) {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.title ILIKE '%${filter}%'
		`);
    },
    
    // ============================== CHEFS ==============================
    allChefs() {
        return db.query(`
            SELECT chefs.*, COUNT(recipes) AS total_recipes FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            GROUP BY chefs.id
            ORDER BY chefs.name ASC
        `);
    }
}
    // ============================ PAGINAÇÃO ============================
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