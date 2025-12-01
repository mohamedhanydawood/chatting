-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL,
  from_user TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  is_dm BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_messages_room_timestamp ON messages(room_id, timestamp);

-- Enable Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read all messages (authentication handled by Clerk)
CREATE POLICY "Allow anyone to read messages"
  ON messages
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert messages (authentication handled by Clerk)
CREATE POLICY "Allow anyone to insert messages"
  ON messages
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow anyone to delete messages (authentication handled by Clerk)
CREATE POLICY "Allow anyone to delete messages"
  ON messages
  FOR DELETE
  USING (true);
