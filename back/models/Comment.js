const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const LikeComment = require('../models/LikeComment');
  
const Comment = sequelize.define('comment', {
    commentId: {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true, 
        onDelete: 'CASCADE',
        references: {
            model: LikeComment,
            key: 'commentId'
        }
    },
    postId: {
        allowNull: false,
        type: Sequelize.INTEGER
    },
    userId: {
        allowNull: false,
        type: Sequelize.INTEGER
    },
    content: { type: Sequelize.STRING, allowNull:false },
    media: { type: Sequelize.STRING, allowNull:true },
    createdAt: { type: Sequelize.DATE, allowNull:false },
    updatedAt: { type: Sequelize.DATE, allowNull:false },
    likes: { type: Sequelize.NUMBER, allowNull:false },
    dislikes: { type: Sequelize.NUMBER, allowNull:false },
    userName: { type: Sequelize.STRING, allowNull:false }
})

Comment.hasMany(LikeComment, {foreignKey: 'commentId', onDelete: 'CASCADE'});

module.exports = Comment;