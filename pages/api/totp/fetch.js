import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET_KEY; // Change this to a secure secret key

export default async function handler(req, res) {
    const { method, body } = req;

    if (method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { token } = body;

        if (!token) {
            return res.status(400).json({ error: 'Bad Request', message: 'Token is missing in the request body' });
        }

        const decodedToken = jwt.verify(token, JWT_SECRET);

        if (decodedToken.exp * 1000 <= Date.now()) {
            return res.status(401).json({ success: false, message: 'Unauthorized!' });
        }

        const { data, error } = await supabase
            .from('tokens')
            .select('*')
            .eq('uid', decodedToken.userId);

        if (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({ error });
        }

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error authenticating user:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token!' });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token has expired!' });
        }

        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
