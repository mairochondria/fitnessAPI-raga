const mongoose = require("mongoose")

const workoutSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: [true, "Workout name is required"]
    },
    duration: {
        type: String,
        required: [true, "Workout duration is required"]
    },
    status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Completed'],
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Workout", workoutSchema);