const { Sequelize } = require('sequelize')

const userModel = require('./models/user')
const todoModel = require('./models/todo')

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: __dirname + '/sqlite.db'
})

sequelize
	.authenticate()
	.then(() => console.log('connected to the database'))
	.catch(err => console.error('cannot connect to the database', err))

const User = userModel(sequelize)
const Todo = todoModel(sequelize)

User.hasMany(Todo)
Todo.belongsTo(User)

sequelize.sync()

module.exports = { User, Todo }
