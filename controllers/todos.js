const user = require('../models/user')
const { Todo } = require('../sequelize')

const getTodos = (req, res, next) => {
	Todo.findAll({
		where: {
			UserId: req.user.id
		},
		attributes: ['id', 'name']
	}).then(todos => res.json({ data: todos }))
}

const createTodo = (req, res, next) => {
	const todo = req.body.todo

	if (!todo || !todo.name || typeof todo.name !== 'string')
		return next({
			statusCode: 400,
			message: 'request body should contain {todo:{name:<string>}}'
		})

	Todo.create(
		{
			...todo,
			UserId: req.user.id
		},
		{}
	).then(todo => res.json({ data: { id: todo.id, name: todo.name } }))
}

const updateTodo = (req, res, next) => {
	const todo = req.body.todo

	if (!todo || !todo.name || typeof todo.name !== 'string')
		return next({
			statusCode: 400,
			message: 'request body should contain {todo:{name:<string>}}'
		})

	Todo.update(todo, {
		where: {
			id: req.params.id,
			UserId: req.user.id
		}
	})
		.then(updated => {
			;[rows] = updated
			console.log('rows:', rows)
			if (rows == 0) return res.status(404).end()

			return Todo.findByPk(req.params.id, {
				attributes: ['id', 'name']
			})
		})
		.then(todo => res.json({ data: todo }))
		.catch(err => console.error(err))
}

const deleteTodo = (req, res, next) => {
	let deletedTodo
	Todo.findOne({
		where: {
			id: req.params.id,
			UserId: req.user.id
		},
		attributes: ['id', 'name']
	})
		.then(todo => {
			if (!todo) return res.status(404).end()

			console.log(todo)
			deletedTodo = todo
			return todo.destroy()
		})
		.then(() => res.json({ data: deletedTodo }))
		.catch(err => console.error(err))
}

module.exports = { getTodos, createTodo, updateTodo, deleteTodo }
