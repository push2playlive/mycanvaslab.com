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

-- Create a table for notification preferences
create table if not exists notification_preferences (
  user_id uuid references auth.users(id) on delete cascade not null primary key,
  email_notifications_enabled boolean default true,
  agent_status_alerts boolean default true,
  marketing_milestone_alerts boolean default true,
  updated_at timestamp with time zone default now()
);

-- RLS for notification preferences
alter table notification_preferences enable row level security;

create policy "Users can view their own notification preferences." on notification_preferences
  for select using (auth.uid() = user_id);

create policy "Users can update their own notification preferences." on notification_preferences
  for update using (auth.uid() = user_id);

create policy "Users can insert their own notification preferences." on notification_preferences
  for insert with check (auth.uid() = user_id);

-- Trigger to create default notification preferences for new users
create or replace function public.handle_new_user_notifications()
returns trigger as $$
begin
  insert into public.notification_preferences (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created_notifications
  after insert on auth.users
  for each row execute procedure public.handle_new_user_notifications();

-- Create a table for users (if not using profiles)
create table if not exists users (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  username text,
  avatar_url text,
  is_pro boolean default false,
  pro_status text default 'standard' check (pro_status in ('standard', 'pro')),
  created_at timestamp with time zone default now()
);

-- RLS for users
alter table users enable row level security;

create policy "Users can view their own data." on users
  for select using (auth.uid() = id);

create policy "Admins can view all users." on users
  for select using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can update users." on users
  for update using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Create a table for scraper logs
create table if not exists v12_scraper_logs (
  id uuid default gen_random_uuid() primary key,
  timestamp timestamp with time zone default now(),
  type text check (type in ('INFO', 'QUERY', 'ERROR')),
  message text,
  target_domain text,
  dispatch_id text,
  details jsonb
);

-- RLS for scraper logs
alter table v12_scraper_logs enable row level security;


-- Create the main users extension table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    is_pro BOOLEAN DEFAULT false,
    is_admin BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT false,
    affiliate_tier INTEGER DEFAULT 1,
    social_links JSONB DEFAULT '{}'::jsonb,
    privacy_settings JSONB DEFAULT '{"profile_visibility": "public"}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;

-- RLS Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
