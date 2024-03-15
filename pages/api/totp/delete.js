import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
    const { method } = req;

    if (method === "POST") {
        const { uid, tid } = req.body;
        console.log(tid)

        try {
            // delete the token and also check if the token belongs to the user
            const { data, error } = await supabase
                .from("tokens")
                .delete()
                .eq("uid", uid)
                .eq("tid", tid)
                .single();

            if (error) {
                console.error("Error deleting token:", error);
                return res.status(500).json({ error: error });
            }

            return res.status(200).json({ success: true, message: "Token deleted successfully!" });
        } catch (error) {
            console.error("Error deleting token:", error);
            return res.status(500).json({ error: error });
        }
    } else {
        // Handle other HTTP methods if needed
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
