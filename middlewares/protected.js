const jwt = require('jsonwebtoken')

const { User } = require('../sequelize')

module.exports = async (req, res, next) => {
    if(!req.headers.authorization){
        console.error('no authorization header')
        return
    }
    console.log('protect middleware');
    const token = req.headers.authorization.replace('Bearer', '').trim()

   try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET)

       const user = await User.findOne({
           where: {
               id: decoded.id
           },
           attributes: ['id', 'name']
       })

       req.user = user
       console.log('authenticated');
       next()
   } catch (err) {
        console.error(err);
   }
}