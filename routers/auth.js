const express = require('express')

const { signup, signin, verifyEmail } = require('../controllers/auth')

const router = express.Router()

router.route('/signup').post(signup)

router.route('/signin').post(signin)

router.route('/verify/').get(verifyEmail)

module.exports = router
