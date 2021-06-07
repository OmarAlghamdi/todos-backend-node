const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User } = require('../sequelize')

const signup = async (req, res, next) => {
    try {
        const u = req.body.user

        const user = await User.create(u)

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        await user.save()

        const payload = {id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION
        })

        return res.json({ data: token })
    } catch (err) {
        console.error(err)
        return next({
            message: 'email is already taken',
            statusCode: 400
        })
    }
}

const signin = async (req, res, next) => {
    const { email, password } = req.body

    const user = await User.findOne({ 
        where: { email: email }
    })

    if(!user)
        return next({
            message: 'email & password do not match',
            statusCode: 400
        })

    const correctPassword = await bcrypt.compare(password, user.password)

    if(!correctPassword)
        return next({
            message: 'email & password do not match',
            statusCode: 400
        })


    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
    })

    return res.json({ data: token })
}

module.exports = { signup, signin }