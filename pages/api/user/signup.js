// pages/api/signup.js

import encrypt from "@/hooks/auth/encrypt";
import { supabase } from "@/lib/supabase";


export default async function handler(req, res) {
    const { method } = req;

    if (method === "POST") {
        const { email, password } = req.body;

        // Get the user's IP address from the request object
        const created_ip = req.headers["x-real-ip"] || req.connection.remoteAddress;

        try {
            const {password: hash, salt} = encrypt(password)
            const { data, error } = await supabase.from("users").insert({
                email,
                password: hash,
                salt,
                created_ip,
            });

            if (error) {
                console.error("Error inserting user:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            // User successfully created
            return res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        // Handle other HTTP methods if needed
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
