const dotenv = require('dotenv')
const Product = require('../models/product')
const connectDatabase = require('../config/database')
const products = require('../data/products.json')

dotenv.config({ path: 'backend/config/config.env' })

connectDatabase()

const seedProducts = async () => {
  try {
    await Product.deleteMany()
    console.log('Product Deleted Successfully')
    await Product.insertMany(products)
    console.log('Product Inserted Successfully')
    process.exit()
  } catch (error) {
    console.log(error.message)
    process.exit()
  }
}

seedProducts()
