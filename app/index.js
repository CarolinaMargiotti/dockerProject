const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const db = require("./db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "/templates/index.html"));
});

app.post("/save", async (req, res) => {
	const id = req.body.id;
	const valor = req.body.valor;
	await db
		.query(`INSERT INTO dados (id,valor) VALUES (${id},'${valor}');`)
		.catch((e) => {
			res.send({ message: "Ocorreu um erro", error: e.message });
			return;
		})
		.then(() => {
			res.send("Dados salvos com sucesso!");
			return;
		});
});

app.get("/get", async (req, res) => {
	const id = req.query.id;
	await db
		.query(`SELECT valor FROM dados WHERE id=${id};`)
		.catch((e) => {
			res.send({ message: "Ocorreu um erro", error: e.message });
			return;
		}).then((value)=>{
			res.send("Valor retornado: "+value.rows[0].valor);
			return;
		});
});

(async () => {
	console.log("Conectando...");
	await db
		.connect()
		.then(() => {
			console.log("Conectou ao banco");
		})
		.catch((e) => {
			console.log("Erro ao conectar no banco: ");
			console.log(e.message);
			console.log("-------------------------");
			console.log(" \n");
			throw e;
		});

	console.log("Criando tabela...");
	await db
		.query(
			"CREATE TABLE IF NOT EXISTS dados (id INTEGER PRIMARY KEY, valor VARCHAR(100))"
		)
		.catch((e) => {
			console.log("Erro ao criar tabela: ");
			console.log(e.message);
			console.log("-------------------------");
			console.log(" \n");
			throw e;
		})
		.then(() => {
			console.log("Tabela criada com sucesso");
		});
})();

app.listen(port, () => {
	console.log(`Escutando porta ${port}`);
});
