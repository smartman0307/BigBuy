const dotenv = require('dotenv')
const app = require('./app')
const connectDatabase = require('./config/database')

const cloudinary = require('cloudinary')

dotenv.config({ path: 'backend/config/config.env' })

// Setting up cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

//Handle uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(`Error:${err.message}`)
  console.log('Shutting down server due to uncaught exception')
  process.exit(1)
})

//connecting to database
connectDatabase()

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server running on Port ${process.env.PORT} in ${process.env.NODE_ENV}`
  )
})

//Handle unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error:${err.message}`)
  console.log('Shutting down server due to unhandled promise rejection')
  server.close(() => {
    process.exit(1)
  })
})
