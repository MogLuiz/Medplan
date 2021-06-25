const Sequelize = require ("sequelize");
const connection = require("./database");

const Paciente = connection.define('pacientes', {
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    prontuario:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    dataCadastro:{
        type: Sequelize.STRING,
        allowNull: false
    },
    nascimento:{
        type: Sequelize.STRING,
        allowNull: false
    },
    convenio:{
        type: Sequelize.STRING,
        allowNull: false
    },
    sexo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    estadoCivil:{
        type: Sequelize.STRING,
        allowNull: false
    },
    cor:{
        type: Sequelize.STRING,
        allowNull: false
    },
    naturalidade:{
        type: Sequelize.STRING,
        allowNull: false
    },
    cpf:{
        type: Sequelize.STRING,
        allowNull: false
    },
    profissao:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    logradouro:{
        type: Sequelize.STRING,
        allowNull: false 
    },
    complemento:{
        type: Sequelize.STRING,
    },
    bairro:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    cidade:{
        type: Sequelize.STRING,
        allowNull: false
    },
    observacoes:{
        type: Sequelize.TEXT,
    },
    uf:{
        type: Sequelize.STRING,
        allowNull: false
    },
    cep:{
        type: Sequelize.STRING,
        allowNull: false
    },
    telefone:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

//vai criar a tabela se não existir. Se existir, não vai forçar a criação
Paciente.sync({force: false}).then(() => {}); 

module.exports = Paciente;