const jwt = require("jsonwebtoken")

require("dotenv").config()

module.exports.createAccessToken = (user) => {
    const data = {
        _id: user._id,
        email: user.email,
    }

    return jwt.sign(data, process.env.JWT_SECRET_KEY, {})
}

module.exports.verify = (req, res, next) => {
    console.log(req.headers.authorization)

    let token = req.headers.authorization

    if (typeof token === 'undefined') {
        return res.status(400).send({ auth: "Failed. No Token"})
    } else {
        console.log(token);
        token = token.slice(7, token.length)
        console.log(token);

        jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken) {
            if (err) {
                return res.status(403).send({
                    auth: "Failed",
                    message: err.message
                })
            } else {
                console.log("result from verify method:");
                console.log(decodedToken);

                req.user = {
                    _id: decodedToken._id,
                    email: decodedToken.email
                };

                next()
            }
        })
    }
}


module.exports.errorHandler = (err, req, res, next) => {
    console.error(err)

    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Internal Server Error'

    res.status(statusCode).json({
        error: {
            message: errorMessage,
            errorCode: err.code || 'SERVER ERROR',
            details: err.details || null
        }
    })
}