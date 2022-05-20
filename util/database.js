//importare sequelize
const Sequelize = require('sequelize');
//creare istanza di collegamento 
const sequelize = new Sequelize('comics','root','root',{
    dialect:'mysql',
    host:'localhost'
});

module.exports = sequelize;