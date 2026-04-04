-- profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  bio text,
  about_me text,
  mood text,
  avatar_url text,
  bg_color text default '#ffffff',
  created_at timestamptz default now()
);

-- friendships table
create table friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  friend_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, friend_id)
);

-- wall_comments table
create table wall_comments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  author_id uuid references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

-- indexes
create index idx_friendships_user_id on friendships(user_id);
create index idx_friendships_friend_id on friendships(friend_id);
create index idx_wall_comments_profile_id on wall_comments(profile_id);
create index idx_wall_comments_author_id on wall_comments(author_id);
create index idx_profiles_username on profiles(username);

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table friendships enable row level security;
alter table wall_comments enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Friendships policies
create policy "Users can view all friendships"
  on friendships for select
  using (true);

create policy "Users can add their own friends"
  on friendships for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own friends"
  on friendships for delete
  using (auth.uid() = user_id);

-- Wall comments policies
create policy "Anyone can view wall comments"
  on wall_comments for select
  using (true);

create policy "Logged-in users can post comments"
  on wall_comments for insert
  with check (auth.uid() = author_id);

create policy "Wall owners can delete comments on their wall"
  on wall_comments for delete
  using (auth.uid() = profile_id);

-- Storage bucket for avatars
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Users can update their own avatars"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own avatars"
  on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
