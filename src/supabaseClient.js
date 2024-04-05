import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://catelzlfmdwiyqapheoh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhdGVsemxmbWR3aXlxYXBoZW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEwODU2MjYsImV4cCI6MjAyNjY2MTYyNn0.lC7fM9BCavSk7j8yyoECYnqctJNc_neHo3-s3hRviHg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
