const db = require('../../config/db');
const fs = require('fs');

module.exports = {
	// Salva o arquivo da imagem na tabela files com os dados nme e path
	createFile({ name, path }) {
		try {
			const query = `
				INSERT INTO files (name, path)
				VALUES ($1, $2)
				RETURNING id
			`;

			const values = [
				name,
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
				WHERE recipe_files.recipe_id = $1
			`, [id]);

			const removeFiles = result.rows.map(async file => {
				fs.unlinkSync(file.path);

				await db.query(`
					DELETE FROM recipe_files
					WHERE file_id = $1
				`, [file.file_id]);

				await db.query(`
					DELETE FROM files
					WHERE id = $1
				`, [file.id]);
			});
				
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