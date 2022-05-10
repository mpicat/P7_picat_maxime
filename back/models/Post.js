const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const LikePost = require('./LikePost');
const Comment = require('./Comment');
  
const Post = sequelize.define('post', {
    postId: {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        onDelete: 'CASCADE',
        references: [{
            model: LikePost,
            key: 'postId'
        },
        {
            model: Comment,
            key: 'postId'  
        }],
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
});

Post.hasMany(LikePost, {foreignKey: 'postId', onDelete: 'CASCADE'});
Post.hasMany(Comment, {foreignKey: 'postId', onDelete: 'CASCADE'});

module.exports = Post;