module.exports = (err, req, res, next) => {
	let message = err.message || 'internal error'
	let statusCode = err.statusCode || 500
	let headers = err.headers || []

	if(statusCode === 401){
		headers.push(['WWW-Authenticate', 'Bearer realm="accessing todos"'])
		message = 'sign in is required'
	}

	for(const header of headers) {
		res.setHeader(...header)
	}

	res.status(statusCode).json({
		success: false,
		message: message
	})
}
