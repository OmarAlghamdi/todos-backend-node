const { Todo } = require('../sequelize')

const getTodos = (req, res, next) => {
    Todo.findAll()
        .then( todos => res.json({ data: todos }))
}

const createTodo = (req, res, next) => {
    const todo = req.body.todo

    Todo.create(todo)
        .then(todo => res.json({ data: todo }))
}

const updateTodo = (req, res, next) => {
    const todo = req.body.todo

    Todo.update(todo, {
        where: { id: req.params.id }
    })
        .then(() => Todo.findByPk(req.params.id))
        .then(todo => res.json({ data: todo }))
        .catch(err => log.error(err))
}

const deleteTodo = (req, res, next) => {
    let deletedTodo
    Todo.findByPk(req.params.id)
        .then(todo => {
            deletedTodo = todo
            return todo.destroy()
        })
        .then(() => res.json({ data: deletedTodo}))
}

module.exports = { getTodos, createTodo, updateTodo, deleteTodo }