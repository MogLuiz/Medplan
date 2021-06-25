const Sequelize = require ("sequelize");
const connection = require("./database");
const Paciente = require("./pacientes");

const Exame = connection.define('exames', {
    texto:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Paciente.hasMany(Exame);
Exame.belongsTo(Paciente);

Exame.sync({force: false}).then(() => {}); 

module.exports = Exame;