const jwt = require("jsonwebtoken")

require("dotenv").config()

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    }

    return jwt.sign(data, process.env.JWT_SECRET_KEY, {})
}

module.exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send({
      auth: 'Failed',
      message: 'No token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).send({
      auth: 'Failed',
      message: 'Invalid token',
      error: error.message,
    });
  }
};

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

                req.user = decodedToken

                next()
            }
        })
    }
}

module.exports.verifyAdmin = (req, res, next) => {
    
    if(req.user && req.user.isAdmin) {

        next();

    } 
    else {
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"

        })
    }

}


module.exports.errorHandler = (err, req, res, next) => {
    console.error(err)

    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Internal Server Error'

    res.status(statusCode).json({
        error: {
            meesage: errorMessage,
            errorCode: err.code || 'SERVER ERROR',
            details: err.details || null
        }
    })
}