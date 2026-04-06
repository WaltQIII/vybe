create policy "Users can delete their own profile"
  on profiles for delete
  using (auth.uid() = id);
