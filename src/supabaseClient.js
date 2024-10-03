import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lonxcalhvgrfsgplpoqv.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvbnhjYWxodmdyZnNncGxwb3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY1NDE1OTEsImV4cCI6MjAyMjExNzU5MX0.hebUTUAYxAOGbk3XUaE4cNeOReYYkUbwlGerJSZFnb4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
