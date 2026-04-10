export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  about_me: string | null;
  mood: string | null;
  avatar_url: string | null;
  bg_color: string;
  song_url: string | null;
  city: string | null;
  country: string | null;
  bg_type: string;
  bg_image_url: string | null;
  blinkies: string[];
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

export interface Conversation {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  last_message_at: string;
  created_at: string;
  other_user?: Profile;
  last_message?: Message;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  read: boolean;
  created_at: string;
  sender?: Profile;
}

export interface Post {
  id: string;
  user_id: string;
  caption: string | null;
  image_url: string | null;
  created_at: string;
  author?: Profile;
  like_count?: number;
  comment_count?: number;
  liked_by_user?: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  created_at: string;
  author?: Profile;
}
