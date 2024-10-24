const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');

const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const corsOptions = {
    origin: ['http://localhost:8000', 'http://localhost:3000', 'http://zuitt-bootcamp-prod-481-7968-raga.s3-website.us-east-1.amazonaws.com'],
    credentials: true,
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))  

mongoose.connect(process.env.MONGODB_STRING)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => console.log("Now connected to MongoDB Atlas"))

app.use('/b1/users', userRoutes);
app.use('/b1/products', productRoutes);
app.use('/b1/cart', cartRoutes);
app.use('/b1/orders', orderRoutes);

if (require.main === module) {
    app.listen(process.env.PORT, () => console.log(`Server running at port ${process.env.PORT}`))
}

module.exports = {app, mongoose}