const Sequelize = require ("sequelize");
const connection = require("./database");
const Paciente = require("./pacientes");

const Anamnese = connection.define('anamneses', {
    texto:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Paciente.hasMany(Anamnese);
Anamnese.belongsTo(Paciente);

Anamnese.sync({force: false}).then(() => {}); 

module.exports = Anamnese;