create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  type text not null check (type in ('wall_comment', 'friend_request', 'friend_accepted')),
  from_user_id uuid references profiles(id) on delete cascade,
  data jsonb default '{}',
  read boolean default false,
  created_at timestamptz default now()
);

create index idx_notifications_user on notifications(user_id, read, created_at desc);

alter table notifications enable row level security;

create policy "Users can view their own notifications"
  on notifications for select using (auth.uid() = user_id);

create policy "Authenticated users can create notifications"
  on notifications for insert with check (auth.role() = 'authenticated');

create policy "Users can update their own notifications"
  on notifications for update using (auth.uid() = user_id);

create policy "Users can delete their own notifications"
  on notifications for delete using (auth.uid() = user_id);
