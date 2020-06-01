const fs = require('fs');
const Intl = require('intl');
const receitas = require('../dados.json'); // Arquivo de dados JSON

// Exibe a página inicial do Admin
exports.index = function(req, res) {
    return res.render("admin/index", { items: receitas.receitas });
};

// Exibe o formulário de cadastro de nova receita
exports.criar = function(req, res) {    
    return res.render("admin/criar");
};

// Executa o comando de salvar novo registro
exports.post = function(req, res) {

    const chaves = Object.keys(req.body);

    for (chave of chaves) {
        if (req.body[chave] == "") {
            return res.send("Preencha todos os campos");
        }
    }

    // Desestruturação do (req.body), ou seja, todas as informações do fomrmulário na DOM.
    // (req.body) que representa todas as informações nos campos do formulário, agora estão dentro de uma variável.
    // Utilizado para tratar as informações em campos específicos.
    let { image, title, author, ingredients, preparation, information } = req.body;

    // Os campos que não vieram no formulário precisam estar em variaveis cada, para trabalhar com a desestruturação do (req.body)
    const id = Number(receitas.receitas.length + 1); // Inserindo informação num campo automaticamente, sem aparecer na tela
    const criadoEm = Date.now();

    receitas.receitas.push({
        id, 
        image,
        title,
        author,
        ingredients, 
        preparation,
        information,
        criadoEm
    });

    // Gravando as informações no arquivo.
    fs.writeFile("dados.json", JSON.stringify(receitas, null, 2), function(err) {
        if (err) {
            return res.send("Erro ao salvar as informações.");
        }
        return res.redirect("admin");
    });

};

// Exibe a página de detalhamento do prato
exports.exibe = function(req, res) {

    const { id } = req.params;

    const foundPrato = receitas.receitas.find(function(item) {
        return item.id == id;
    });

    if (!foundPrato) {
        return res.render("frontend/not-found");
    }

    //  Ajuste dos dados nos campos escolhidos
    const item = {
        ...foundPrato, // Spread
        criadoEm: new Intl.DateTimeFormat("pt-BR").format(foundPrato.criadoEm),
    }

    return res.render("admin/prato", { item });
};

// Exibe o formulário de edição com os campos preenchidos
exports.edita = function(req, res) {
    
    const { id } = req.params;

    const foundPrato = receitas.receitas.find(function(item) {
        return item.id == id;
    });

    if (!foundPrato) {
        return res.render("frontend/not-found");
    }

    return res.render("admin/editar", { item: foundPrato });

};

// Executa o comando de atualizar os dados do registro
exports.put = function(req, res) {
    
    const { id } = req.body;
    // Váriavel para guardar o index
    let index = 0;

    // 'find' é uma estrutura de repetição. Pode receber dois parametros. O segundo é o índice encontrado
    const foundPrato = receitas.receitas.find(function(item, foundIndex) {
        if (id == item.id) {
            index = foundIndex;
            return true;
        }
    });

    if (!foundPrato) {
        return res.render("frontend/not-found");
    }

    const item = {
        ...foundPrato,
        ...req.body
    }

    // Verificação da posição do index
    receitas.receitas[index] = item;

    fs.writeFile("dados.json", JSON.stringify(receitas, null, 2), function(err) {
        if (err) {
            return res.send("Erro ao salvar a informação");
        }

        return res.redirect(`prato/${id}`);
    });
};

// Comando para deletar o registro encontrado
exports.delete = function(req, res) {
    const { id } = req.body;
    
    // Função de busca no array 'filter'
    const filtroPrato = receitas.receitas.filter(function(item) {
        return item.id != id;
    });

    receitas.receitas = filtroPrato;

    console.log(filtroPrato);   
    
    fs.writeFile("dados.json", JSON.stringify(receitas, null, 2), function(err) {
        if (err) {
            return res.send("Erro ao salvar a informação");
        }
        return res.redirect("/admin");
    });
};

exports.notFound = function(req, res) {
    res.status(404).render("/frontend/not-found");
};
