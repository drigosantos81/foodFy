const db = require('../../config/db');
const fs = require('fs');

module.exports = {
    // ==== Tabela FILES ====

    // Salva o arquivo da imagem na tabela files com os dados nme e path
    createFile({ filename, path }) {
        try {
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
        } catch (error) {
            console.log(error);
        }
    },
    // Deleta registro/arquivo da tabela files
    async deleteFile(id) {
        try {
            return db.query(`
                DELETE FROM files
                WHERE id = $1
            `, [id]);
        } catch (error) {
            console.log(error);
        }
    },
    
    // ==== Tabela RECIPE_FILES ====

    // Salva a referência da imagem da receita na tabela recipe_files
    createRecipeFile({ recipe_id, file_id }) {
        try {
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
        } catch (error) {
            console.log(error);
        }
    },
    // Deleta registro/arquivo da tabela recipe_files e files referente a uma receita
    async deleteRecipeFile(id) {
        try {
            const result = await db.query(`
            SELECT files.* FROM files
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
    // Deleta registro da tabela files referente ao Chef na tabela chefs
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