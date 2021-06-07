module.exports = (err, req, res, next) => {
    let message = err.message || 'internal error'
    let statusCode = err.statusCode || 500

    res.status(statusCode).json({
        success: false,
        message: message
    })
}