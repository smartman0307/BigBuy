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
  updateProfile,
  allUsers,
  getUserDetails,
  updateUser,
  deleteUser,
} = require('../controllers/authController')

const { isAuthenticatedUser, authorizedUser } = require('../middlewares/auth')

router.route('/register').post(registerUser)
router.route('/profile').get(isAuthenticatedUser, getUserProfile)
router.route('/profile/update').put(isAuthenticatedUser, updateProfile)

router.route('/login').post(loginUser)
router.route('/logout').get(logout)

router.route('/password/forgot').post(forgotPassword)
router.route('/password/update').put(isAuthenticatedUser, updatePassword)
router.route('/password/reset/:token').put(resetPassword)

router
  .route('/admin/users')
  .get(isAuthenticatedUser, authorizedUser('admin'), allUsers)
router
  .route('/admin/user/:id')
  .get(isAuthenticatedUser, authorizedUser('admin'), getUserDetails)
  .put(isAuthenticatedUser, authorizedUser('admin'), updateUser)
  .delete(isAuthenticatedUser, authorizedUser('admin'), deleteUser)

module.exports = router
