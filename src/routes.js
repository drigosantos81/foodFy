const express = require('express');
const routes = express.Router();
const front = require('./app/controllers/front');
const admin = require('./app/controllers/admin');

// HOME/START
routes.get("/", function(req, res) {
    return res.redirect("/frontend");
});

// FRONTEND
routes.get("/frontend", front.index);
routes.get("/sobre", front.sobre);
routes.get("/receitas", front.receitas);
routes.get("/prato/:id", front.prato);
// routes.use("/not-found", front.notFound);

//ADMIN
routes.get("/admin", admin.index);
// routes.get("/admin/criar", admin.criar); // Mostrar formulário de nova receita
// routes.post("/admin", admin.post); // Cadastrar nova receita
// routes.get("/admin/prato/:id", admin.exibe); // Exibir página com detalhes de uma receita
// routes.get("/admin/prato/:id/edit", admin.edita); // Mostrar formulário de edição de receita
// routes.put("/admin/prato", admin.put); // Editar uma receita
// routes.delete("/admin", admin.delete); // Deletar uma receita

module.exports = routes;
