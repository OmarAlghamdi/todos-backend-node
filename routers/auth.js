const express = require('express')

const { signup, signin } = require('../controllers/auth')

const router = express.Router()

router.route('/signup').post(signup)

router.route('/signin').post(signin)

module.exports = router
