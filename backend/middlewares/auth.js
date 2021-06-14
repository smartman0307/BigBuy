//Authenticate User

const jwt = require('jsonwebtoken')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('./catchAsyncErrors')
const User = require('../models/user')

//Check if user is authenticated
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies

  if (!token) {
    return next(new ErrorHandler('Login to access the resourse', 401))
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  req.user = await User.findById(decoded.id)

  next()
})

//Authorized Users
exports.authorizedUser = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} is not authorized to access this resource`,
          403
        )
      )
    }
    next()
  }
}
