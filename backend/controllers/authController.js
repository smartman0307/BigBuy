const User = require('../models/user')

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const sendToken = require('../utils/jwtToken')

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: 'dkjsvkjsb',
      url:
        'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTN8MjAxMzUyMHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
  })

  sendToken(user, 200, res)
})

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body

  //Check if email and password is entered
  if (!email || !password) {
    return next(
      new ErrorHandler('Please enter email and password to proceed', 400)
    )
  }

  //Find user in database
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401))
  }

  //Check if password match
  const isPasswordMatched = await user.comparePassword(password)

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401))
  }
  sendToken(user, 200, res)
})

//Logout User

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: 'Logged Out',
  })
})
