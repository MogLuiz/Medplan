const Sequelize = require ("sequelize");
const connection = require("./database");
const bcrypt = require('bcryptjs')

const Usuario = connection.define('user', {
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    senha:{
        type: Sequelize.STRING,
        allowNull: false 
    },
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
});

//vai criar a tabela se não existir. Se existir, não vai forçar a criação
Usuario.sync({force: false}).then(() => {}); 

var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("12345", salt);

//criando os usuários e senhas se não existirem
Usuario.findOrCreate({
    where: {id: 1},
    defaults: {
        email: "medico@gmail.com",
        senha: hash,
        nome: "Dr. Rosalvo"
    }
});
Usuario.findOrCreate({
    where: {id: 2},
    defaults: {
        email: "secretaria@gmail.com",
        senha: hash,
        nome: "Secretária"
    }
});

module.exports = Usuario;