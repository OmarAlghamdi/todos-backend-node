const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UniqueConstraintError, ValidationError } = require('sequelize')

const { User } = require('../sequelize')

const signup = async (req, res, next) => {
	try {
		const u = req.body.user

		if(!u || !u.name || !u.password || !u.email
			|| typeof u.name !== 'string' || typeof u.password !== 'string' || typeof u.email !== 'string') 
			return next({
				statusCode: 400,
				message: 'request body should contain {user:{name:<string>, email:<string>, password:<string>}}'
			})

		const user = await User.create(u)

		const salt = await bcrypt.genSalt(10)
		user.password = await bcrypt.hash(user.password, salt)
		await user.save()

		const payload = { id: user.id }
		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRATION
		})

		return res.json({ data: token })
	} catch (err) {
		console.error(err)
		
		if (err instanceof UniqueConstraintError)
		return next({
			message: 'email is already taken',
			statusCode: 400
		})

		else if(err instanceof ValidationError) 
			return next({
				message: 'a valid email should be used',
				statusCode: 400
			})
	}
}

const signin = async (req, res, next) => {
	const { email, password } = req.body

	if(!email || !password
		|| typeof email !== 'string' || typeof password !== 'string')
		return next({
			statusCode: 400,
			message: 'request body should contain {email<string>, password:<string>}'
		})

	const user = await User.findOne({
		where: { email: email }
	})

	if (!user)
		return next({
			message: 'email is not registered, want to sign up?',
			statusCode: 404
		})

	const correctPassword = await bcrypt.compare(password, user.password)

	if (!correctPassword)
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
