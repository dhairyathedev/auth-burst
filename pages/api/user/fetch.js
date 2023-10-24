
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET_KEY; // Change this to a secure secret key

export default async function handler(req, res) {
    const { method } = req;

    if (method === 'POST') {
        const { token } = req.body; // token specifies JWT auth token

        try {
            const decodedToken = jwt.verify(token, JWT_SECRET)

            if (decodedToken.exp * 1000 > Date.now()) {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('uid', decodedToken.userId);

                if (error) {
                    console.error('Error fetching user:', error);
                    return res.status(500).json({ error });
                }
                if (data[0].uid === undefined) {
                    res.status(500).json({ success: false, message: "User not found!" })
                } else {
                    return res.status(200).json({ success: true, data });
                }
            } else {
                res.status(401).json({ success: false, message: 'Unauthorized!' });
            }
        } catch (error) {
            console.error('Error authenticating user:', error);
            return res.status(500).json({ error: 'User not found!' });
        }
    } else {
        // Handle other HTTP methods if needed
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
