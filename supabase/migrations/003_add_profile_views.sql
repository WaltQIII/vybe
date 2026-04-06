create table profile_views (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade not null,
  viewer_id uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

create index idx_profile_views_profile_id on profile_views(profile_id);
create unique index idx_profile_views_unique on profile_views(profile_id, viewer_id);

alter table profile_views enable row level security;

create policy "Anyone can view profile view counts"
  on profile_views for select using (true);

create policy "Logged-in users can record views"
  on profile_views for insert
  with check (auth.uid() = viewer_id);
