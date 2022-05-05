const Sequelize = require('sequelize')
const sequelize = require('../utils/database')
  
const LikeComment = sequelize.define('likecomment', {
    likeCommentId:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    commentId: {
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

module.exports = LikeComment;