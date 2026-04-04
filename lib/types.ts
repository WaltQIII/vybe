export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  about_me: string | null;
  mood: string | null;
  avatar_url: string | null;
  bg_color: string;
  created_at: string;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  created_at: string;
}

export interface WallComment {
  id: string;
  profile_id: string;
  author_id: string;
  body: string;
  created_at: string;
  author?: Profile;
}
