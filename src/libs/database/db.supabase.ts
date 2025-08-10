import { createClient } from "@supabase/supabase-js";
import { envSupabaseDBConfig } from "../configs/configs.env";

const supabaseUrl = envSupabaseDBConfig.DB_SUPABASE_URL;
const supabaseKey = envSupabaseDBConfig.DB_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
