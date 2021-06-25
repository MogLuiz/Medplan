const Sequelize = require ('sequelize'); //importando módulo

const connection = new Sequelize('medplan', 'medplan123', '35117423l', {
    host: 'mysql742.umbler.com', 
    dialect: 'mysql' ,
    timezone: "-03:00"
});

module.exports = connection;