-- Ensure like_count column exists in virtual_rooms
ALTER TABLE virtual_rooms ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- Room Likes Table
-- Tracks which users have liked which virtual rooms

CREATE TABLE IF NOT EXISTS room_likes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES virtual_rooms(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, room_id)
);

-- Enable RLS
ALTER TABLE room_likes ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'room_likes' AND policyname = 'Users can view their own likes'
    ) THEN
        CREATE POLICY "Users can view their own likes" ON room_likes
          FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'room_likes' AND policyname = 'Users can insert their own likes'
    ) THEN
        CREATE POLICY "Users can insert their own likes" ON room_likes
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'room_likes' AND policyname = 'Users can delete their own likes'
    ) THEN
        CREATE POLICY "Users can delete their own likes" ON room_likes
          FOR DELETE USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Trigger to increment like_count
CREATE OR REPLACE FUNCTION increment_room_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE virtual_rooms
  SET like_count = like_count + 1
  WHERE id = NEW.room_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_room_like_added ON room_likes;
CREATE TRIGGER on_room_like_added
  AFTER INSERT ON room_likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_room_like_count();

-- Trigger to decrement like_count
CREATE OR REPLACE FUNCTION decrement_room_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE virtual_rooms
  SET like_count = GREATEST(0, like_count - 1)
  WHERE id = OLD.room_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_room_like_removed ON room_likes;
CREATE TRIGGER on_room_like_removed
  AFTER DELETE ON room_likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_room_like_count();
