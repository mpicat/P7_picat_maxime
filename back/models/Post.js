const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
  
const Post = sequelize.define('post', {
    postId: {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    userId: {
        allowNull: false,
        type: Sequelize.INTEGER
    },
    content: { type: Sequelize.STRING, allowNull:false },
    media: { type: Sequelize.STRING, allowNull:true },
    createdAt: { type: Sequelize.DATE, allowNull:false },
    updatedAt: { type: Sequelize.DATE, allowNull:false }
})

module.exports = Post;