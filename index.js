const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const passport = require("passport");
const session = require("express-session");
require('./passport.js');
const userRoutes = require("./routes/user")
const courseRoutes = require('./routes/course')

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

app.use(session({
    secret: process.env.clientSecret,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());

app.use(passport.session());

app.use('/users', userRoutes)
app.use('/courses', courseRoutes)

mongoose.connect(process.env.MONGODB_STRING)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => console.log("Now connected to MongoDB Atlas"))

if (require.main === module) {
    app.listen(process.env.PORT, () => console.log(`Server running at port ${process.env.PORT}`))
}

module.exports = {app, mongoose}