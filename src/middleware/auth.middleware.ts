import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const validateKarmaList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    
    // Call to Lendsqr Karma API
    const response = await fetch(`${process.env.KARMA_API_URL}/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.KARMA_API_KEY}`
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    
    if (data.blacklisted) {
      return res.status(403).json({ message: 'User is blacklisted' });
    }

    next();
  } catch (error) {
    next(error);
  }
};