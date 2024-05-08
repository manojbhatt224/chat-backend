import jwt from 'jsonwebtoken'
import User from '../models/User.js'

var checkUserAuth = async (req, res, next) => {
  let token
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get Token from header
      token = authorization.split(' ')[1]

      // Verify Token
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)
  
      // Get User from Token
      req.user = await User.findById(userID).select('-password')

      next()
    } catch (error) {
      console.log(error)
      res.sendData(401, "Unauthorized User")
    //   res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
    }
  }
  if (!token) {
    res.sendData(401, "User not authenticated with token")
    // res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
  }
}

export default checkUserAuth