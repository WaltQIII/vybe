create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id) on delete cascade not null,
  reported_user_id uuid references profiles(id) on delete cascade,
  reported_comment_id uuid references wall_comments(id) on delete set null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'dismissed')),
  created_at timestamptz default now()
);

create index idx_reports_status on reports(status, created_at desc);

alter table reports enable row level security;

create policy "Users can create reports"
  on reports for insert with check (auth.uid() = reporter_id);

create policy "Users can view their own reports"
  on reports for select using (auth.uid() = reporter_id);

create or replace function is_admin() returns boolean as $$
  select auth.uid()::text in (
    select id::text from profiles where username = 'admin'
  );
$$ language sql security definer;

create policy "Admins can view all reports"
  on reports for select using (is_admin());

create policy "Admins can update reports"
  on reports for update using (is_admin());

create table blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid references profiles(id) on delete cascade not null,
  blocked_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(blocker_id, blocked_id)
);

create index idx_blocks_blocker on blocks(blocker_id);
create index idx_blocks_blocked on blocks(blocked_id);

alter table blocks enable row level security;

create policy "Users can view their own blocks"
  on blocks for select using (auth.uid() = blocker_id);

create policy "Users can create blocks"
  on blocks for insert with check (auth.uid() = blocker_id);

create policy "Users can remove blocks"
  on blocks for delete using (auth.uid() = blocker_id);
