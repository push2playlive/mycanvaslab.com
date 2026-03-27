-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'user');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- To manually set a user as admin, run:
-- update profiles set role = 'admin' where id = 'YOUR_USER_ID';

-- Create a table for projects (if not already exists)
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  name text not null,
  description text,
  lat float8 not null,
  lng float8 not null,
  status text default 'active',
  owner_id uuid references auth.users(id)
);

-- Create a table for chat messages
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  provider text default 'gemini'
);

-- RLS for messages
alter table messages enable row level security;

create policy "Users can view their own messages." on messages
  for select using (auth.uid() = user_id);

create policy "Users can insert their own messages." on messages
  for insert with check (auth.uid() = user_id);

-- RLS for projects (Admin only for insert/update/delete)
alter table projects enable row level security;

create policy "Projects are viewable by everyone." on projects
  for select using (true);

create policy "Admins can manage projects." on projects
  for all using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
