const Sequelize = require('sequelize')
const sequelize = require('../utils/database')
  
const User = sequelize.define('user', {
    userId:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        onDelete: 'CASCADE'
    },
    name: {
        type: Sequelize.STRING,
        allowNull:false,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull:false,
        unique: true
    },
    password: { type: Sequelize.STRING, allowNull:false },
    status: { type: Sequelize.STRING, allowNull:false },
    confirmationToken: { type: Sequelize.STRING, allowNull:false },
    admin: { type: Sequelize.STRING, allowNull:false},
    createdAt: { type: Sequelize.DATE, allowNull:false },
    updatedAt: { type: Sequelize.DATE, allowNull:false }
})

module.exports = User;