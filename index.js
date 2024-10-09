const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const session = require("express-session");
const userRoutes = require("./routes/user")
const productRoutes = require('./routes/product')
const cartRouter = require('./routes/cart')

const app = express()
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const corsOptions = {
    origin: ['http://localhost:8000'],
    credentials: true,
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/cart', cartRouter)

mongoose.connect(process.env.MONGODB_STRING)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => console.log("Now connected to MongoDB Atlas"))

if (require.main === module) {
    app.listen(process.env.PORT, () => console.log(`Server running at port ${process.env.PORT}`))
}

module.exports = {app, mongoose}