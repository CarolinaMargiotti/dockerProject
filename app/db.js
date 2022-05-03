const { Pool, Client } = require("pg");
const client = new Client({
	user: "postgres",
	host: "banco-1",
	database: "testedb",
	password: "senha1234",
	port: "5432",
});

module.exports = client;
