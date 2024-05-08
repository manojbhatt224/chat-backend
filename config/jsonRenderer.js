function customResponse(req, res, next) {
    res.sendData = (statusCode, message, data = {}) => {
        res.status(statusCode).json({
            success: statusCode >= 200 && statusCode < 300,
            message,
            data
        });
    };
    next();
}

export default customResponse;