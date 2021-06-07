const express = require('express')

const protected = require('../middlewares/protected')
const { getTodos, createTodo, updateTodo, deleteTodo } = require('../controllers/todos')

const router = express.Router()

router.route('/')
    .get(protected, getTodos)
    .post(protected, createTodo)
router.route('/:id')
    .put(protected, updateTodo)
    .delete(protected, deleteTodo)

module.exports = router