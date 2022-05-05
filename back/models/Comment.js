const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const LikeComment = require('../models/LikeComment');
const User = require('./User');
  
const Comment = sequelize.define('comment', {
    commentId: {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
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
        type: Sequelize.INTEGER,
        references: {
            model: User, 
            key: 'userId',
        }
    },
    content: { type: Sequelize.STRING, allowNull:false },
    media: { type: Sequelize.STRING, allowNull:true },
    createdAt: { type: Sequelize.DATE, allowNull:false },
    updatedAt: { type: Sequelize.DATE, allowNull:false },
    likes: { type: Sequelize.NUMBER, allowNull:false },
    dislikes: { type: Sequelize.NUMBER, allowNull:false }
})

Comment.belongsTo(User, {foreignKey: 'userId'});
Comment.hasMany(LikeComment, {foreignKey: 'commentId'});

module.exports = Comment;