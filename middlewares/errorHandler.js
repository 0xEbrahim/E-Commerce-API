import appError from '../utils/error.js'
import { ERROR } from '../utils/errorText.js';
// not found
const notFound = (req, res, next) => {
    const error = appError.create("Resource not found.",404,ERROR);
    next(error)
}

// error handler
const errorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({status : err.statusText || ERROR , message : err.message, code :err.statusCode || 500 , data : null});
}

export {notFound, errorHandler}