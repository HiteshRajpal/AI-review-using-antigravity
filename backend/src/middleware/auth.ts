import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';
import User from '../models/User';

export interface AuthRequest extends Request {
    user?: any; // You can type this better with your IUser interface
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ msg: 'No token, authorization denied' });
        return;
    }

    try {
        // Attempt Firebase verify. If no credentials, we might just mock it for dev
        if (process.env.NODE_ENV === 'development' && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            // Mock auth for local dev without firebase keys
            const mockUser = await User.findOne();
            if (mockUser) {
                req.user = mockUser;
                return next();
            }
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const firebaseUid = decodedToken.uid;

        let user = await User.findOne({ firebaseUid });

        if (!user) {
            // Auto-create user if they don't exist in MongoDB yet
            user = new User({
                firebaseUid,
                email: decodedToken.email,
                name: decodedToken.name || 'User',
            });
            await user.save();
        }

        req.user = user;
        next();
    } catch (err: any) {
        console.error('Auth Error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default authMiddleware;
