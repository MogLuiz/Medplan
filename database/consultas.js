const Sequelize = require ("sequelize");
const connection = require("./database");
const Paciente = require("./pacientes");

const Consulta = connection.define('consulta', {
    data:{
        type: Sequelize.DATE,
        allowNull: false
    },
    hora:{
        type: Sequelize.STRING,
        allowNull: false
    },
    tipo:{
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
    }
});

Paciente.hasMany(Consulta); //Paciente tem muitas consultas
Consulta.belongsTo(Paciente); //relacionamento 1 para 1

//vai criar a tabela se não existir. Se existir, não vai forçar a criação
Consulta.sync({force: false}).then(() => {}); 

module.exports = Consulta;