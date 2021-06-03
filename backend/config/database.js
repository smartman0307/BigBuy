const mongoose = require('mongoose')

const connectDatabase = async () => {
  const con = await mongoose.connect(process.env.DB_LOCAL_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  console.log(`Mongo Database connected with ${con.connection.host}`)
}

module.exports = connectDatabase
