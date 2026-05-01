const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        
        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'You are not logged in! Please log in to get access.',
            });
        }

        // NEW: Verify the token using your secret key.
        // Ensure process.env.JWT_SECRET matches what you used during login/registration.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // NEW: Attach the decoded user data (like id and role) to the request
        req.user = decoded;

        next();
    } catch (error) {
        console.error('Error during authentication:', error);
        
        // If the token is invalid or expired, send a clean error response
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid token or session expired. Please log in again.',
        });
    }
}

module.exports = checkAuth;