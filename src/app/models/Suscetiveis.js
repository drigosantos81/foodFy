const crypto = require('crypto');
const fs = require('fs');

const db = require('../../config/db-atena');
// const Files = require('../models/Files');
const { date } = require('../../lib/utils');
// const { hash } = require('bcryptjs');

module.exports = {
	// Retorna os dados de todos os Usuários
	async allUsers() {
		try {
			return db.query(`
				SELECT * FROM users
				ORDER BY name ASC
			`);
		} catch (error) {
			console.log(error);
		}
	},

	async userLogged(id) {
		try {
			return db.query(`
				SELECT * FROM users
				WHERE id = $1
			`, [id]);
		} catch (error) {
			console.log(error);
		}
	},

	// Retorna os dados de um Usuário
	async findOne(filters) {
		try {
			let query = "SELECT * FROM users";

			Object.keys(filters).map(key => {
				query = `${query}
				${key}
				`

				Object.keys(filters[key]).map(field => {
					query = `${query} ${field} = '${filters[key][field]}'`
				});
			});

			const results = await db.query(query);

			return results.rows[0];

		} catch (error) {
			console.log(error);
		}
	},

	async postSuscetiveis(data) {
		try {
			const query = `
				INSERT INTO suscetiveis (dataref, acao, utd, zcgaccoun, zcgmtvcon, pecld_cons, latitude, longitude, zona, zcgmunici, zcglocali, zcgbairro, score, flag_sel, zcgqtftve, zcgtiploc)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
				
			`;
// RETURNING id
			const values = [
				data.dataref,
				data.acao,
				data.utd,
				data.zcgaccoun,
				data.zcgmtvcon,
				data.pecld_cons,
				data.latidude,
				data.longitude,
				data.zona,
				data.zcgmunici,
				data.zcglocali,
				data.zcgbairro,
				data.score,
				data.flag_def,
				data.zcgqtftve,
				data.zcgtiploc,
			]

			return db.query(query, values);

		} catch (error) {
			console.log(error);
		}
	},

	showUser(id) {
		try {
			return db.query(`
				SELECT * FROM users
				WHERE id = $1
			`, [id]);
			
		} catch (error) {
			console.log(error);
		}
	},

	async recipesUser(id) {
		try {
			return db.query(`
				SELECT recipes.*, COUNT(*), users.name FROM recipes
				INNER JOIN users ON (recipes.user_id = users.id)
				WHERE users.id = $1
				GROUP BY recipes.id, users.name
				ORDER BY recipes.title ASC
			`, [id]);
		} catch (error) {
			console.log(error);
		}
	},

	async updateProfile(id, fields) {
		try {
			let query = `UPDATE users SET`;
			// Verificação de todos os campos da tabela no banco
			Object.keys(fields).map((key, index, array) => {
				if ((index + 1) < array.length) {
					query = `${query}
						${key} = '${fields[key]}',
					`
				} else {
					query = `${query}
						${key} = '${fields[key]}'
						WHERE id = ${id}
					`
				}
			});
			
			await db.query(query);

			return;
		} catch (error) {
			console.log(error);
		}
	},

	async updateUser(id, fields) {
		try {
			let query = `UPDATE users SET`;

			Object.keys(fields).map((key, index, array) => {
				if ((index + 1) < array.length) {
					query = `${query}
						${key} = '${fields[key]}'
					`
				} else {
					query = `${query}
						${key} = '${fields[key]}'
						WHERE id = ${id}
					`
				}
			});

			await db.query(query);

			return;

		// 	return db.query(`
		// 		UPDATE users SET
		// 		WHERE id = $1
		// `, [id]);
		} catch (error) {
			console.log(error);
		}
	},

	async delete(id) {
		try {
			// Pegar todos as receitas
			let results = await db.query('SELECT * FROM recipes WHERE user_id = $1', [id]);
			const recipes = results.rows;

			// Das receitas, pegar todas as imagens
			const allFilesPromise = recipes.map(async recipe =>
				await Files.deleteRecipeFile(recipe.id)
			);

			// Deletar o usuário
			await db.query(`DELETE FROM users WHERE id = $1`, [id]);

		} catch (error) {
			console.error(error);
		}
	}

}