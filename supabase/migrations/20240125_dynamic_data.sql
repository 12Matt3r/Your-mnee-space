
-- Governance Proposals
create table if not exists public.proposals (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  status text check (status in ('Active', 'Passed', 'Rejected', 'Pending')) default 'Active',
  votes_for integer default 0,
  votes_against integer default 0,
  end_date timestamp with time zone not null,
  tags text[], -- Array of strings e.g. ['Treasury', 'Tech']
  created_at timestamp with time zone default now()
);

-- Subscription Tiers
create table if not exists public.subscription_tiers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price numeric not null,
  mnee_bonus integer default 0,
  bonus_percent integer default 0,
  features text[], -- Array of strings
  recommended boolean default false,
  color text default 'blue',
  created_at timestamp with time zone default now()
);

-- Guestbook Entries
create table if not exists public.guestbook_entries (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) not null, -- Owner of the profile being signed
  author_id uuid references public.profiles(id) not null, -- Who signed it
  message text not null,
  created_at timestamp with time zone default now()
);

-- Top 8 Friends
create table if not exists public.top_eight (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  friend_id uuid references public.profiles(id) not null,
  position integer not null check (position >= 1 and position <= 8),
  created_at timestamp with time zone default now(),
  unique(user_id, position)
);

-- Learning Modules
create table if not exists public.learning_modules (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  video_url text,
  thumbnail_url text,
  category text,
  difficulty_level text,
  created_at timestamp with time zone default now()
);

-- Learning Steps
create table if not exists public.learning_steps (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.learning_modules(id) on delete cascade not null,
  title text not null,
  content text,
  "order" integer not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS (Row Level Security)
alter table public.proposals enable row level security;
alter table public.subscription_tiers enable row level security;
alter table public.guestbook_entries enable row level security;
alter table public.top_eight enable row level security;
alter table public.learning_modules enable row level security;
alter table public.learning_steps enable row level security;

-- Policies (Public Read)
create policy "Public proposals are viewable by everyone" on public.proposals for select using (true);
create policy "Public tiers are viewable by everyone" on public.subscription_tiers for select using (true);
create policy "Public guestbook is viewable by everyone" on public.guestbook_entries for select using (true);
create policy "Public top 8 is viewable by everyone" on public.top_eight for select using (true);
create policy "Public modules are viewable by everyone" on public.learning_modules for select using (true);
create policy "Public steps are viewable by everyone" on public.learning_steps for select using (true);

-- Policies (Authenticated Write - simplified for demo)
create policy "Users can sign guestbooks" on public.guestbook_entries for insert with check (auth.uid() = author_id);
create policy "Users can manage top 8" on public.top_eight for all using (auth.uid() = user_id);
