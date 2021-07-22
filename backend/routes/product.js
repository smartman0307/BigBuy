const express = require('express')
const router = express.Router()

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
} = require('../controllers/productController')

const { isAuthenticatedUser, authorizedUser } = require('../middlewares/auth')

router.route('/products').get(getProducts)
router.route('/admin/products').get(getAdminProducts)
router.route('/product/:id').get(getSingleProduct)

router
  .route('/admin/product/new')
  .post(isAuthenticatedUser, authorizedUser('admin'), newProduct)

router
  .route('/admin/product/:id')
  .put(isAuthenticatedUser, authorizedUser('admin'), updateProduct)
  .delete(isAuthenticatedUser, authorizedUser('admin'), deleteProduct)

router.route('/review').put(isAuthenticatedUser, createProductReview)
router.route('/reviews').get(isAuthenticatedUser, getProductReviews)
router.route('/reviews').delete(isAuthenticatedUser, deleteReview)

module.exports = router
