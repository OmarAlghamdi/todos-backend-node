const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mailjet = require('node-mailjet').connect(
	process.env.MJ_APIKEY_PUBLIC,
	process.env.MJ_APIKEY_PRIVATE
)

const { UniqueConstraintError, ValidationError } = require('sequelize')

const { User } = require('../sequelize')

const sendVerificationEmail = async (email, name, link) => {
	return mailjet.post('send', { version: 'v3.1' }).request({
		Messages: [
			{
				From: {
					Email: process.env.EMAIL,
					Name: 'Todos'
				},
				To: [
					{
						Email: email,
						Name: name
					}
				],
				Subject: 'Welcome to Todos',
				TextPart: `To verify your email follow this link: ${process.env.DNS_HOSTNAME}/auth/verify/${link}`,
				HTMLPart:
					`<h3>Welcome to <a href='${process.env.HOSTNAME}/'>Todos</a>!</h3><br />To verify your email visit <a href='${process.env.DNS_HOSTNAME}/auth/verify/${link}'/>${process.env.DNS_HOSTNAME}/auth/verify/${link}<a>`,
				// CustomID: 'AppGettingStartedTest'
			}
		]
	})
}

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

		// const payload = { id: user.id }
		// const token = jwt.sign(payload, process.env.JWT_SECRET, {
		// 	expiresIn: process.env.JWT_EXPIRATION
		// })

		user.verificationLink = await bcrypt.hash(user.id, salt)
		await user.save()

		// return res.json({ data: token })

		try {
			await sendVerificationEmail(user.email, user.name, user.verificationLink)
			console.log('send successfully')
		} catch (err) {
			console.error(err);
		}
		

		return res.json({
			data: 'a verification email has been sent to you. please see your email.'
		})
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

	if (!user.emailVerified)
		return next({
			message: 'your account has not been verified, please check the link send to your email',
			statusCode: 403
		})

	const payload = { id: user.id }
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRATION
	})

	return res.json({ data: token })
}

const verifyEmail = async (req, res, next) => {
	let token = req.query.token
	token = token.substring(1, token.length-1)
	console.log(`verify: ${token}`)

	const user = await User.findOne({
		where: {
			verificationLink: token
		}
	})

	if (!user)
		return next({
			message: 'invalid verification link',
			statusCode: 404
		})

	user.emailVerified = true
	user.verificationLink = null
	await user.save()

	return res.json({
		data: 'your account has been verified, please log in.'
	})
}

module.exports = { signup, signin, verifyEmail }
