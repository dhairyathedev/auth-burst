// pages/api/login.js
import jwt from 'jsonwebtoken';
import encrypt from '@/hooks/auth/encrypt';
import { supabase } from '@/lib/supabase';
import applyRateLimit from '@/lib/rate-limit';

const DELAY_TIME_MS = 1000; // Set your desired delay time in milliseconds
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET_KEY; // Change this to a secure secret key

export default async function handler(req, res) {
    const { method } = req;
    if (method === 'POST') {
        try {
            await applyRateLimit(req, res)
        } catch {
            return res.status(429).send('Too many requests')
        }
        const { email, password } = req.body;

        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email);

            if (error) {
                console.error('Error fetching user:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const { uid, password: hash, salt } = data[0];

            // Introduce intentional delay before checking the password
            await delay(DELAY_TIME_MS);

            const { password: inputHash } = encrypt(password, salt);

            if (inputHash === hash) {
                // Generate a JWT token
                const token = jwt.sign({ userId: uid }, JWT_SECRET, {
                    expiresIn: '1h', // Set an expiration time
                });

                return res.status(200).json({ success: true, token });
            } else {
                res.status(401).json({ success: false, message: 'Unauthorized!' });
            }
        } catch (error) {
            console.error('Error authenticating user:', error);
            return res.status(500).json({ error: 'Email not found!' });
        }
    } else {
        // Handle other HTTP methods if needed
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

// Helper function to introduce delays
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
