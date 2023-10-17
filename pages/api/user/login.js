import encrypt from "@/hooks/auth/encrypt";
import { supabase } from "@/lib/supabase";

const DELAY_TIME_MS = 1000; // Set your desired delay time in milliseconds

export default async function handler(req, res) {
    const { method } = req;

    if (method === "POST") {
        const { email, password } = req.body;

        try {
            const { data, error } = await supabase.from("users").select("*").eq("email", email);

            if (error) {
                console.error("Error inserting user:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            const { password: hash, salt } = data[0];

            // Introduce intentional delay before checking the password
            await delay(DELAY_TIME_MS);

            const {password: inputHash} = encrypt(password, salt);

            if (inputHash === hash) {
                return res.status(200).json({ success: true, data });
            } else {
                res.status(401).json({ success: false, message: "Unauthorized!" });
            }
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        // Handle other HTTP methods if needed
        res.status(405).json({ error: "Method Not Allowed" });
    }
}

// Helper function to introduce delays
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
