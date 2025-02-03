import jwt from 'jsonwebtoken';

// Middleware function to authenticate the user
const userAuth = async (req, res, next) => {
    const { token } = req.cookies; // Extract token from cookies

    // Check if token is not present
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this website' });
    }

    try {
        // Verify the token using the secret key
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the token contains a valid user ID
        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id; // Attach the user ID to the request body
        } else {
            return res.status(401).json({ success: false, message: 'Not authorized to access this website' });
        }

        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        // Handle any errors during token verification
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export default userAuth;
