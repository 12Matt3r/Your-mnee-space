
-- Marketplace Items (Products for Sale)
create table if not exists public.marketplace_items (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  price numeric not null, -- MNEE price
  asset_url text, -- URL to the digital file
  preview_url text, -- Image/Video preview
  category text, -- 'model', 'audio', 'image', 'other'
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Purchases (Transaction Record)
create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references public.profiles(id) not null,
  item_id uuid references public.marketplace_items(id) not null,
  transaction_hash text not null, -- Blockchain tx hash
  amount_paid numeric not null,
  created_at timestamp with time zone default now()
);

-- Social Polls
create table if not exists public.polls (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  question text not null,
  options jsonb not null, -- Array of {id, text}
  created_at timestamp with time zone default now()
);

-- Poll Votes
create table if not exists public.poll_votes (
  id uuid default gen_random_uuid() primary key,
  poll_id uuid references public.polls(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  option_id text not null,
  created_at timestamp with time zone default now(),
  unique(poll_id, user_id) -- One vote per user per poll
);

-- Events
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  organizer_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone,
  location text, -- Virtual URL or Physical location
  cover_image text,
  attendee_count integer default 0,
  created_at timestamp with time zone default now()
);

-- RLS Policies
alter table public.marketplace_items enable row level security;
alter table public.purchases enable row level security;
alter table public.polls enable row level security;
alter table public.poll_votes enable row level security;
alter table public.events enable row level security;

-- Public Read
create policy "Marketplace items are public" on public.marketplace_items for select using (true);
create policy "Polls are public" on public.polls for select using (true);
create policy "Events are public" on public.events for select using (true);

-- Authenticated Write
create policy "Users can list items" on public.marketplace_items for insert with check (auth.uid() = seller_id);
create policy "Users can buy items" on public.purchases for insert with check (auth.uid() = buyer_id);
create policy "Users can vote" on public.poll_votes for insert with check (auth.uid() = user_id);
create policy "Users can create events" on public.events for insert with check (auth.uid() = organizer_id);
