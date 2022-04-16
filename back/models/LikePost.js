const Sequelize = require('sequelize')
const sequelize = require('../utils/database')
  
const LikePost = sequelize.define('likepost', {
    likePostId:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    postId: {
        allowNull: false,
        type: Sequelize.INTEGER
    },
    userId: {
        allowNull: false,
        type: Sequelize.INTEGER
    },
    likeType: { type: Sequelize.STRING, allowNull:false },
    createdAt: { type: Sequelize.DATE, allowNull:false },
    updatedAt: { type: Sequelize.DATE, allowNull:false }
})

module.exports = LikePost;