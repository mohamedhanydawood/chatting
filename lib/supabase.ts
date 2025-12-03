import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test Supabase connection
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  console.log("Testing Supabase connection...");
  try {
    const { error } = await supabase.from("messages").select("id").limit(1);

    if (error) {
      console.error("Supabase connection failed:", error);
      return {
        success: false,
        message: `Supabase connection failed: ${error.message}`,
      };
    }
    console.log("Supabase connection successful.");
    return {
      success: true,
      message: "Supabase connected successfully!",
    };
  } catch (err) {
    return {
      success: false,
      message: `Connection error: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
    };
  }
}

// Database types
export interface DatabaseMessage {
  id: string;
  room_id: string;
  from_user: string;
  text: string;
  timestamp: number;
  is_dm: boolean;
  created_at: string;
}

// Helper functions for message operations
export async function saveMessage(
  roomId: string,
  fromUser: string,
  text: string,
  isDm: boolean = false
): Promise<DatabaseMessage | null> {
  const res = await testSupabaseConnection();
  console.log("Supabase connection test result:", res);
  console.log("alooooooooooooooooooooooooooooooo");
  const { data, error } = await supabase
    .from("messages")
    .insert({
      room_id: roomId,
      from_user: fromUser,
      text,
      timestamp: Date.now(),
      is_dm: isDm,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving message:", error);
    return null;
  }

  return data;
}

export async function getMessagesByRoom(
  roomId: string,
  limit: number = 100
): Promise<DatabaseMessage[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("room_id", roomId)
    .order("timestamp", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return data || [];
}

export async function deleteMessage(messageId: string): Promise<boolean> {
  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId);

  if (error) {
    console.error("Error deleting message:", error);
    return false;
  }

  return true;
}
