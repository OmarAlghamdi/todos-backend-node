const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User } = require('../sequelize')

const signup = async (req, res, next) => {
    const u = req.body.user

    const user = await User.create(u)

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()

    const payload = {id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
    })

    res.json({ data: token })
}

const signin = async (req, res, next) => {
    const { email, password } = req.body

    const user = await User.findOne({ 
        where: { email: email }
    })

    const correctPassword = await bcrypt.compare(password, user.password)


    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
    })

    res.json({ data: token })
}

module.exports = { signup, signin }