const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
    // Retorna os dados de todas as Receitas
    all() {
        try {
            return db.query(`
                SELECT recipes.*, chefs.name AS chef_name FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                ORDER BY recipes.created_at DESC
            `);
        } catch (error) {
            console.log(error);
        }
    },
    // Comando POST para nova Receita
    post(data) {
        try {
            const query = `
                INSERT INTO recipes (chef_id, title, ingredients, preparation, information, created_at, updated_at, user_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
            `;

            const values = [
                data.chef,
                data.title,
                data.ingredients,
                data.preparation,
                data.information,
                date(Date.now()).iso,
                date(Date.now()).iso,
                data.user_id
            ]

            return db.query(query, values);
        } catch (error) {
            console.log(error);
        }
    },
    // Retorna os dados de uma Receita
    find(id) {
        try {
            return db.query(`
                SELECT recipes.*, chefs.name AS chef_name FROM recipes 
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.id = $1
            `, [id]
            );
        } catch (error) {
            console.log(error);
        }
    },
    // Retorna as imagens de uma Receita
    files(id) {
        try {
            return db.query(`
                SELECT files.*, recipe_files.* FROM files
                LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
                LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
                WHERE recipes.id = $1
            `, [id]);
        } catch (error) {
            console.log(error);
        }
    },
    // Retorna as imagens que serão removidas no Update
    fileRecipeRemoved(id) {
        try {
            return db.query(`
                SELECT files.* FROM files
                LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
                WHERE recipe_files.id = $1
            `, [id]);
        } catch (error) {
            console.log(error);
        }
    },
    // Update da tabela recipe_files apagando a referência com a tabela files
    async updateRecipeFilesFileId(id) {
        try {
            return db.query(`
                UPDATE recipe_files SET
                file_id = null
                WHERE id = $1
            `, [id]);
        } catch (error) {
            console.log(error);
        }
    },
    // Update da tabela Recips
    update(data) {
        try {
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
        } catch (error) {
            console.log(error);
        }
    },
    // Delete de uma Receita
    delete(id) {
        try {
            return db.query(`
                DELETE FROM recipes 
                WHERE id = $1
            `, [id]);
        } catch (error) {
            console.log(error);
        }
    },
    // Pesquisa por Receitas
    search(params) {
        try {
            const { filter, chefs } = params;

            let query = ``,
                filterQuery = `WHERE`

            if (chefs) {
                filterQuery = `${filterQuery} recipes.chef_id = ${chefs}
                    AND`
            }

            filterQuery = `${filterQuery} recipes.title ILIKE '%${filter}%'
                OR recipes.information ILIKE '%${filter}%'
            `

            let total_query = `(
                SELECT count(*) FROM recipes
                ${filterQuery}
            ) AS total`
            
            query = `
                SELECT recipes.*, ${total_query}, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
                ${filterQuery}
                GROUP BY recipes.id, chefs.name
                ORDER BY recipes.updated_at DESC
            `
            
            return db.query(query);
        } catch (error) {
            console.log(error);
        }
    }
}