const { Sequelize } = require('sequelize')

const userModel = require('./models/user')
const todoModel = require('./models/todo')

// Sqlite config
// const sequelize = new Sequelize({
// 	dialect: 'sqlite',
// 	storage: __dirname + '/sqlite.db'
// })

// mysql config
const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD,{
	host: process.env.MYSQL_HOST,
	dialect: 'mysql'
})

sequelize
	.authenticate()
	.then(() => console.log('connected to the database'))
	.catch(err => console.error('cannot connect to the database', err))

const User = userModel(sequelize)
const Todo = todoModel(sequelize)

User.hasMany(Todo)
Todo.belongsTo(User)

sequelize.sync({
	alter: true
})

module.exports = { User, Todo }
