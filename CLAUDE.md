# MySpace Clone — Project Brief

## Project Overview

A nostalgic, MySpace-inspired social web app built with modern tooling. The goal is a fun,
personalized social profile experience where users can express themselves through customizable
profiles, connect with friends, and leave messages on each other's walls.

Start simple. Ship working features before adding complexity.

---

## Tech Stack

| Layer       | Tool                          |
|-------------|-------------------------------|
| Framework   | Next.js 14+ (App Router)      |
| Database    | Supabase (Postgres)           |
| Auth        | Supabase Auth                 |
| Styling     | Tailwind CSS                  |
| Deployment  | Vercel                        |
| Storage     | Supabase Storage (avatars)    |

---

## Phase 1 — MVP (Build This First)

### Auth
- Sign up / login via Supabase Auth (email + password)
- Redirect to profile setup on first login
- Protect all pages behind auth except public profile pages

### Profile Page (`/profile/[username]`)
- Display name, username, bio (max 300 chars)
- Profile photo (upload to Supabase Storage)
- Background color picker (stored in DB, applied to profile page)
- "About Me" freeform text block
- Mood status (short text like "feeling creative ✨")
- Public — anyone can view, only owner can edit

### Comment Wall
- Text comments left by other logged-in users on any profile
- Show commenter's display name + avatar + timestamp
- Owner can delete comments on their own wall
- No threading — flat list, newest first

### Top Friends
- Each user can add up to 8 friends from other users
- Displayed as a grid of avatars + display names on profile page
- Clicking a friend goes to their profile

### Home Feed (`/`)
- Shows recent comments and profile updates from your top friends
- Simple chronological list, no algorithm
- Login required

---

## Database Schema (Supabase)

```sql
-- profiles
id uuid references auth.users primary key
username text unique not null
display_name text
bio text
about_me text
mood text
avatar_url text
bg_color text default '#ffffff'
created_at timestamptz default now()

-- friendships
id uuid primary key default gen_random_uuid()
user_id uuid references profiles(id)
friend_id uuid references profiles(id)
created_at timestamptz default now()
unique(user_id, friend_id)

-- wall_comments
id uuid primary key default gen_random_uuid()
profile_id uuid references profiles(id)   -- whose wall
author_id uuid references profiles(id)    -- who wrote it
body text not null
created_at timestamptz default now()
```

---

## File Structure

```
/app
  /                     → Home feed (auth required)
  /login                → Login page
  /signup               → Signup page
  /profile/[username]   → Public profile page
  /settings             → Edit your own profile
/components
  ProfileCard.tsx
  CommentWall.tsx
  TopFriends.tsx
  FeedItem.tsx
  AvatarUpload.tsx
/lib
  supabase.ts           → Supabase client
  auth.ts               → Auth helpers
```

---

## Design Direction

- Fun and expressive — this should feel personal, not corporate
- Allow users to make their profile feel unique (colors, mood, about me)
- Mobile-friendly but desktop-first for now
- No dark mode needed in Phase 1

---

## Phase 2 — After MVP Is Solid

- Profile song (embed a YouTube or SoundCloud link, autoplay on profile visit)
- Profile view counter ("Walter has been visited 42 times")
- Blinkies / GIF stickers on profiles
- Extended color/theme customization (background image, font color)
- Friend requests (currently add without approval)
- Direct messages between friends
- Notification system (someone commented on your wall)

---

## Environment

- OS: Windows
- Shell: CMD (not PowerShell, not bash)
- Use Windows-compatible commands only (e.g. `mkdir`, `copy`, `del` — not `mkdir -p`, `cp`, `rm`)
- Use backslashes for file paths or forward slashes where Node.js handles them
- Do not generate shell scripts (.sh) — use .bat or .cmd if scripting is needed

---

## Development Rules

- Always use TypeScript
- Use Supabase Row Level Security (RLS) on all tables
- Never expose service role keys client-side
- Keep components small and focused
- Commit working features before moving to the next one
- Ask before making architectural changes not listed here
