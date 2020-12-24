const db = require('../../config/db');
const fs = require('fs');

module.exports = {
    createFile({ filename, path }) {
        const query = `
            INSERT INTO files (name, path)
            VALUES ($1, $2)
            RETURNING id
        `;

        const values = [
            filename,
            path
        ]

        return db.query(query, values);
    },
    
    createRecipeFile({ recipe_id, file_id }) {
        const query = `
            INSERT INTO recipe_files (recipe_id, file_id)
            VALUES ($1, $2)
            RETURNING id
        `;

        const values = [
            recipe_id,
            file_id
        ]

        return db.query(query, values);
    },

    async deleteRecipeFile(id) {
        try {
            const result = await db.query(`
                SELECT * FROM files
                LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
                WHERE recipe_files.id = $1
            `, [id]);

            const file = result.rows[0];

            fs.unlinkSync(file.path);

            return db.query(`
                DELETE FROM recipe_files
                WHERE id = $1
            `, [id]);
            
        } catch (error) {
            console.log(error);
        }
    },

    async deleteFile(id) {
        try {
            return db.query(`
                DELETE FROM files
                WHERE id IN (SELECT files.id FROM recipe_files
                    LEFT JOIN files ON (recipe_files.file_id = files.id)
                    WHERE file_id = $1)
            `, [id]);
        } catch (error) {
            console.log(error);
        }
    },

    async updateChefFileId(id) {
        try {
            return db.query(`
                UPDATE chefs SET
                file_id = null
                WHERE id = $1
            `, [id]);
        } catch (error) {
            console.log(error);
        }
    },

    async deleteFileChef(id) {
        try {
            const result = await db.query(`
                SELECT * FROM files
                WHERE id = $1
                
            `, [id]);
            
            const file = result.rows[0];

            fs.unlinkSync(file.path);

            return db.query(`
                DELETE FROM files
                WHERE id = $1
            `, [id]);
            
        } catch (error) {
            console.log(error);
        }
    }
}