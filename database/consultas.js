const Sequelize = require ("sequelize");
const connection = require("./database");

const Consulta = connection.define('consulta', {
    dia:{
        type: Sequelize.INTEGER,
        allowNull: true
    },
    mes:{
        type: Sequelize.INTEGER,
        allowNull: true
    },
    ano:{
        type: Sequelize.INTEGER,
        allowNull: true
    },
    hora:{
        type: Sequelize.STRING,
        allowNull: false
    },
    tipo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    convenio:{
        type: Sequelize.STRING,
        allowNull: false
    },
    valor:{
        type: Sequelize.FLOAT,
        allowNull: false
    },
    status:{
        type: Sequelize.STRING,
        allowNull: true
    },
    chegada:{
        type: Sequelize.STRING,
        allowNull: true
    },
    atendido:{
        type: Sequelize.STRING,
        allowNull: true
    },
    notas:{
        type: Sequelize.TEXT,
        allowNull: true
    },
});

//vai criar a tabela se não existir. Se existir, não vai forçar a criação
Consulta.sync({force: false}).then(() => {}); 

module.exports = Consulta;