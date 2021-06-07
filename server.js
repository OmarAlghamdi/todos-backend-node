require('dotenv').config()
const express = require('express')

const auth = require('./routers/auth')
const todos = require('./routers/todos')

const db = require('./sequelize')

const app = express()

app.use(express.json())

app.use('/api/auth', auth)
app.use('/api/todos', todos)

const PORT = process.env.PORT || 3000
app.listen(PORT, console.log(`server's been started on port ${PORT}`))