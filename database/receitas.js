const Sequelize = require ("sequelize");
const connection = require("./database");
const Paciente = require("./pacientes");

const Receita = connection.define('receitas', {
    texto:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Paciente.hasMany(Receita);
Receita.belongsTo(Paciente);

Receita.sync({force: false}).then(() => {}); 

module.exports = Receita;