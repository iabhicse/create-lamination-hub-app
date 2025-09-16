import { AuthError } from "@supabase/supabase-js";
import { supabase } from "../../libs/db/db.supabase";

export const updateUserFullname = async (fullname: string, email: string) => {
    if (!email) throw new AuthError("Email not found or unauthorized", 401);

    const { data, error } = await supabase
        .from("iLocalusers") // ✅ consistent casing
        .update({ fullname })
        .eq("email", email);

    if (error) {
        throw error;
    }

    return data;
};
