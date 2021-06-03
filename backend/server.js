const dotenv = require('dotenv')
const app = require('./app')
const connectDatabase = require('./config/database')

dotenv.config({ path: 'backend/config/config.env' })

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
