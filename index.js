const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const userRoutes = require('./routes/user');
const workoutRoutes = require('./routes/workout');

const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const corsOptions = {
    origin: ['http://localhost:8000', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))  

mongoose.connect(process.env.MONGODB_STRING)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => console.log("Now connected to MongoDB Atlas"))

app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);

if(require.main === module){
    app.listen(process.env.PORT || 4000, () => {
        console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
    });
}

module.exports = {app,mongoose};