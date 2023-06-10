// Middleware for protecting routes
export const authenticate = (req, res, next) => {
    console.log(req, `req`);
    
  // Get the token from the authorization header
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Verify and decode the token
  // Here, you would use a JWT library to verify and decode the token

  // Check if the token is valid
  if (!validToken) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Attach the authenticated user to the request object for future use
  req.user = decodedToken.user;
  
  next();
};