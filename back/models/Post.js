const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const LikePost = require('./LikePost');
const User = require('./User');
  
const Post = sequelize.define('post', {
    postId: {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        references: {
            model: LikePost,
            key: 'postId'
        }
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
});

Post.belongsTo(User, {foreignKey: 'userId'});
Post.hasMany(LikePost, {foreignKey: 'postId'});

module.exports = Post;