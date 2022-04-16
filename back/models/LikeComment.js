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
        type: Sequelize.INTEGER,
        references: {
          model:'Comment',
          key: 'comment_id'
        }
    },
    userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model:'User',
          key: 'user_id'
        }
    },
    likeType: { type: Sequelize.STRING, allowNull:false },
    createdAt: { type: Sequelize.DATE, allowNull:false },
    updatedAt: { type: Sequelize.DATE, allowNull:false }
})

module.exports = LikeComment;