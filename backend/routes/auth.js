const express = require('express')
const router = express.Router()

const {
  registerUser,
  getUserProfile,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController')

const { isAuthenticatedUser } = require('../middlewares/auth')

router.route('/register').post(registerUser)
router.route('/profile').get(isAuthenticatedUser, getUserProfile)

router.route('/login').post(loginUser)
router.route('/logout').get(logout)

router.route('/password/forgot').post(forgotPassword)
router.route('/password/update').put(isAuthenticatedUser, updatePassword)
router.route('/password/reset/:token').put(resetPassword)

module.exports = router
