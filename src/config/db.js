const { Pool } = require('pg');

module.exports = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "Maker@1",
    database: "foodfy",
});

// host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,