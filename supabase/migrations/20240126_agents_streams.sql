
-- Agents Marketplace
create table if not exists public.agents (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  agent_type text, -- 'design', 'dev', 'content', etc.
  avatar_url text,
  hourly_rate numeric not null,
  skills text[],
  performance_score numeric default 0,
  total_jobs integer default 0,
  is_available boolean default true,
  is_listed boolean default true,
  created_at timestamp with time zone default now()
);

-- Agent Jobs (The work contracts)
create table if not exists public.agent_jobs (
  id uuid default gen_random_uuid() primary key,
  agent_id uuid references public.agents(id),
  requester_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  status text check (status in ('pending', 'in_progress', 'completed', 'cancelled')) default 'pending',
  budget numeric not null,
  transaction_hash text, -- To link to MNEE payment
  created_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);

-- Live Streams
create table if not exists public.streams (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  title text,
  status text check (status in ('live', 'ended')) default 'live',
  viewer_count integer default 0,
  started_at timestamp with time zone default now(),
  ended_at timestamp with time zone
);

-- RLS Policies
alter table public.agents enable row level security;
alter table public.agent_jobs enable row level security;
alter table public.streams enable row level security;

-- Public Read
create policy "Agents are viewable by everyone" on public.agents for select using (true);
create policy "Streams are viewable by everyone" on public.streams for select using (true);

-- Authenticated Job Access
create policy "Users can see their own jobs" on public.agent_jobs for select using (auth.uid() = requester_id);
create policy "Users can create jobs" on public.agent_jobs for insert with check (auth.uid() = requester_id);

-- Stream Management
create policy "Users can manage their own streams" on public.streams for all using (auth.uid() = user_id);
