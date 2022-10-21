const {DataTypes} = require('sequelize')

const db= require('../db/conn')

const User = require('./User')
const Thought = require('./Thought')

const Comment = db.define('Comment', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true
  }
})

Comment.belongsTo(User)
Comment.belongsTo(Thought)
User.hasMany(Comment)
Thought.hasMany(Comment)

module.exports = Comment