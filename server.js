require('dotenv').config()
const express = require('express')
const https = require('https')
const fs = require('fs')

const auth = require('./routers/auth')
const todos = require('./routers/todos')

require('./sequelize')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(express.json())

app.use('/api/auth', auth)
app.use('/api/todos', todos)

app.use(errorHandler)

const PORT = process.env.PORT || 80
const HTTPS_PORT = process.env.HTTPS_PORT || 433
app.listen(PORT, console.log(`server's been started on port ${PORT}`))

https.createServer({
    key: fs.readFileSync(__dirname + '/ssl/selfsigned.key'),
    cert: fs.readFileSync(__dirname + '/ssl/selfsigned.crt')
}, app)
    .listen(HTTPS_PORT, console.log(`https is available on port ${HTTPS_PORT}`))
