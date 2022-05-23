const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Comic = sequelize.define('comic',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true,
        unique:true
    },
    title: {
        type:Sequelize.STRING,
        allowNull:false
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull:false
    },
    image: {
        type: Sequelize.STRING,
        allowNull:false
    },
    description: {
        type: Sequelize.STRING,
        allowNull:true
    }
});

module.exports = Comic;