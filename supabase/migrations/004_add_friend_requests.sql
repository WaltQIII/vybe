create table friend_requests (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references profiles(id) on delete cascade not null,
  to_user_id uuid references profiles(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz default now(),
  unique(from_user_id, to_user_id)
);

create index idx_friend_requests_to on friend_requests(to_user_id, status);
create index idx_friend_requests_from on friend_requests(from_user_id, status);

alter table friend_requests enable row level security;

create policy "Users can view their own requests"
  on friend_requests for select
  using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create policy "Users can send friend requests"
  on friend_requests for insert
  with check (auth.uid() = from_user_id);

create policy "Recipients can update request status"
  on friend_requests for update
  using (auth.uid() = to_user_id);

create policy "Users can delete their own sent requests"
  on friend_requests for delete
  using (auth.uid() = from_user_id or auth.uid() = to_user_id);
