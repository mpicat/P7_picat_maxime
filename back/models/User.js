const Sequelize = require('sequelize')
const sequelize = require('../utils/database')
  
const User = sequelize.define('user', {
    userId:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name: { type: Sequelize.STRING, allowNull:false },
    email: { type: Sequelize.STRING, allowNull:false },
    password: { type: Sequelize.STRING, allowNull:false },
    status: { type: Sequelize.STRING, allowNull:false },
    confirmationToken: { type: Sequelize.STRING, allowNull:false },
    admin: { type: Sequelize.STRING, allowNull:false},
    createdAt: { type: Sequelize.DATE, allowNull:false },
    updatedAt: { type: Sequelize.DATE, allowNull:false }
})

module.exports = User;