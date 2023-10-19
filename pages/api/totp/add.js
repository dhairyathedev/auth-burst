import { supabase } from "@/lib/supabase";
import { decodeTOTPToken, hashTOTPToken } from "@/hooks/auth/encrypt";

export default async function handler(req, res) {
    const { method } = req;

    if (method === "POST") {
        const { uid, token, password, account_name, account_service, digits } = req.body;


        try {
            const { data, error } = await supabase.from("tokens").insert({
                uid,
                token: hashTOTPToken(token, password, uid),
                account_name,
                account_service,
                digits
            }).select();

            if (error) {
                console.error("Error inserting token:", error);
                return res.status(500).json({ error: error });
            }

            // User successfully created
            return res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).json({ error: error });
        }
    } else {
        // Handle other HTTP methods if needed
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
