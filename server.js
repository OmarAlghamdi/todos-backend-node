require('dotenv').config()
const express = require('express')
const https = require('https')
const http = require('http')
const fs = require('fs')

const auth = require('./routers/auth')
const todos = require('./routers/todos')

const PORT = process.env.PORT || 80
const HTTPS_PORT = process.env.HTTPS_PORT || 433

require('./sequelize')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(express.json())

app.use('/api/auth', auth)
app.use('/api/todos', todos)

app.use(errorHandler)

http.createServer((req, res) => {
    const [host,] = req.headers.host.split(':')
    console.log(host);
    res.writeHead(301, { "Location": `https://${host}:${HTTPS_PORT}${req.url}`});
    res.end();
}).listen(PORT, console.log(`http is available on port ${PORT}\nbut all request will be redirected to https on port ${HTTPS_PORT}`))

https.createServer({
    key: fs.readFileSync(__dirname + '/ssl/selfsigned.key'),
    cert: fs.readFileSync(__dirname + '/ssl/selfsigned.crt')
}, app)
    .listen(HTTPS_PORT, console.log(`https is available on port ${HTTPS_PORT}`))
