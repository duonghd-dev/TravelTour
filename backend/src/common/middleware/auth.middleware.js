import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';


export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      ...decoded,
      _id: decoded.userId, 
    };
    next();
  } catch (err) {
    logger.warn('Invalid token:', err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};


export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      logger.warn(
        `User ${req.user.id} tried to access resource with insufficient role`
      );
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};
