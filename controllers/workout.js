const Workout = require("../models/Workout");
const {errorHandler} = require("../auth");

module.exports.addWorkout = (req, res) => {
	let newWorkout = new Workout({
		name: req.body.name,
		duration: req.body.duration,
		userID: req.user._id,
	});

	newWorkout
		.save()
		.then((result) =>
			res.status(201).send(result)
		)
		.catch((error) => errorHandler(error, req, res));
};

module.exports.getMyWorkouts = (req, res) => {
	return Workout.find({})
		.then((result) => {
			if (result.length === 0) {
				return res.status(404).send({message: "No workouts found"});
			}

			return res.status(200).send({workouts: result});
		})
		.catch((error) => errorHandler(error, req, res));
};

module.exports.updateWorkout = (req, res) => {
	const {workoutId} = req.params;
	const updateData = req.body;

	return Workout.findByIdAndUpdate(workoutId, updateData, {new: true})
		.then((updatedWorkout) => {
			if (!updatedWorkout) {
				return res.status(404).send({message: "Workout not found"});
			} else {
				return res.status(200).send({
					message: "Workout updated successfully",
					updatedWorkout: updatedWorkout
				});
			}
		})
		.catch((error) => errorHandler(error, req, res));
};

module.exports.deleteWorkout = (req, res) => {
    const { workoutId } = req.params;

    return Workout.findByIdAndDelete(workoutId)
        .then((deletedWorkout) => {
            if (!deletedWorkout) {
                return res.status(404).send({ message: "Workout not found" });
            } else {
                return res.status(200).send({
                    message: "Workout deleted successfully"
                });
            }
        })
        .catch((error) => errorHandler(error, req, res));
};

module.exports.completeWorkoutStatus = (req, res) => {
    const { workoutId } = req.params;

    const updateData = { status: 'Completed' };

    return Workout.findByIdAndUpdate(workoutId, updateData, { new: true })
        .then((updatedWorkout) => {
            if (!updatedWorkout) {
                return res.status(404).send({ message: "Workout not found" });
            } else {
                return res.status(200).send({
                    message: "Workout status updated successfully",
                    updatedWorkout: updatedWorkout,
                });
            }
        })
        .catch((error) => errorHandler(error, req, res));
};