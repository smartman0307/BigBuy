const crypto = require('crypto')

const User = require('../models/user')

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')

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

//Forgot password /api/v1/password/forgot

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorHandler('User not found with this email', 404))
  }

  //get reset token
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  //create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/password/reset/${resetToken}`

  const message = `Please use this link to reset your password:\n\n ${resetUrl}\n\n if you have not requested please ignore`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Bigbuy Password Recovery',
      message,
    })

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorHandler(error.message, 500))
  }
})

//Reset Password /api/password/reset
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //Hash password token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(
      new ErrorHandler('Password reset link is invliad or expired', 400)
    )
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match', 400))
  }

  //Setup new password
  user.password = req.body.password

  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  sendToken(user, 200, res)
})

//Update Password /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  //verify if old password is correct
  const isMatched = await user.comparePassword(req.body.oldPassword)

  if (!isMatched) {
    return next(new ErrorHandler('Oldpassword is not correct', 400))
  }

  user.password = req.body.password

  await user.save()

  sendToken(user, 200, res)
})

//Get Logged in user profile /api/v1/profile

exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    user,
  })
})

//Update User Profile /api/v1/profile/update

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
  }

  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
  })
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

//Admin Routes

//Get All Users /api/v1/admin/users

exports.allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    success: true,
    users,
  })
})

//Get User Details /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(
      new ErrorHandler(`User does not exists with id :${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    user,
  })
})

//Update User details /api/v1/admin/user/:id

exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  }

  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
  })
})

//Delete User /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(
      new ErrorHandler(`User does not exists with id :${req.params.id}`, 404)
    )
  }

  await user.remove()

  res.status(200).json({
    success: true,
  })
})
