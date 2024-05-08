// socketAuth.js
import jwt from 'jsonwebtoken';

const socketAuth = (socket, next) => {
    const token = socket.handshake.headers.token;
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            // res.sendData(401, "Unauthorized User",{'error':err})
            console.log(err)
            return next(new Error('Authentication error'));
        }
        console.log(decoded.userID)
        socket.id = decoded.userID; // Store user ID from token in socket session
        next();
    });
};

export default socketAuth;
