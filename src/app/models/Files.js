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
    }
}