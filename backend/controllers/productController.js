const { listeners } = require('../models/product')
const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')

exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id

  const product = await Product.create(req.body)

  res.status(201).json({
    success: true,
    product,
  })
})

exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 4
  const productCount = await Product.countDocuments()

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage)

  const products = await apiFeatures.query

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  })
})

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    return next(new ErrorHandler('Product Not Found', 404))
  }

  res.status(200).json({
    success: true,
    product,
  })
})

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id)

  if (!product) {
    return next(new ErrorHandler('Product Not Found', 404))
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
    product,
  })
})
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id)

  if (!product) {
    return next(new ErrorHandler('Product Not Found', 404))
  }

  // product = await Product.findByIdAndDelete(req.params.id)
  await product.remove()

  res.status(200).json({
    success: true,
    message: `Product ${product.id} Deleted`,
  })
})
