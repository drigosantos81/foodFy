const crypto = require('crypto');
const fs = require('fs');

const db = require('../../config/db');
const Files = require('../models/Files');
const { date } = require('../../lib/utils');
const { hash } = require('bcryptjs');

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

	async post(data) {
		try {
			const query = `
				INSERT INTO users (name, email, password, reset_token, reset_token_expires, is_admin, created_at, updated_at)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
				RETURNING id
			`;

			let password = crypto.randomBytes(8).toString("hex");
			password = await hash(password, 8);

			// Criação do Token
			const token = crypto.randomBytes(20).toString('hex');
			// Expiração do Token
			let now = new Date();
			now = now.setHours(now.getHours() + 1);

			const values = [
				data.name,
				data.email,
				password,
				token,
				now,
				data.is_admin,
				date(Date.now()).iso,
				date(Date.now()).iso
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