-- Create expertise_categories table
create table public.expertise_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- Create expert_expertise table (many-to-many)
create table public.expert_expertise (
  expert_id uuid references public.experts(user_id),
  category_id uuid references public.expertise_categories(id),
  years_experience integer not null default 0,
  primary key (expert_id, category_id)
);

-- Create portfolio_items table
create table public.portfolio_items (
  id uuid primary key default uuid_generate_v4(),
  expert_id uuid references public.experts(user_id) not null,
  title text not null,
  description text,
  image_url text,
  link_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create review_categories table
create table public.review_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- Add category ratings to reviews
create table public.review_ratings (
  review_id uuid references public.reviews(id),
  category_id uuid references public.review_categories(id),
  rating integer not null check (rating >= 1 and rating <= 5),
  primary key (review_id, category_id)
);

-- Add fields to reviews table
alter table public.reviews
  add column verified boolean not null default false,
  add column moderation_status text not null default 'pending' 
    check (moderation_status in ('pending', 'approved', 'rejected')),
  add column moderation_notes text,
  add column moderated_at timestamptz,
  add column moderated_by uuid references auth.users(id);

-- Add RLS policies
alter table public.expertise_categories enable row level security;
alter table public.expert_expertise enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.review_categories enable row level security;
alter table public.review_ratings enable row level security;

-- Policies for expertise categories (public read, admin write)
create policy "Public can view expertise categories"
  on public.expertise_categories for select
  to public
  using (true);

-- Policies for expert expertise (public read, expert write own)
create policy "Public can view expert expertise"
  on public.expert_expertise for select
  to public
  using (true);

create policy "Experts can manage their expertise"
  on public.expert_expertise for all
  using (auth.uid() = expert_id);

-- Policies for portfolio items
create policy "Public can view portfolio items"
  on public.portfolio_items for select
  to public
  using (true);

create policy "Experts can manage their portfolio"
  on public.portfolio_items for all
  using (auth.uid() = expert_id);

-- Policies for review categories (public read, admin write)
create policy "Public can view review categories"
  on public.review_categories for select
  to public
  using (true);

-- Policies for review ratings (public read, client write own)
create policy "Public can view review ratings"
  on public.review_ratings for select
  to public
  using (true);

create policy "Clients can rate their reviews"
  on public.review_ratings for insert
  using (exists (
    select 1 from public.reviews
    where id = review_id
    and client_id = auth.uid()
  ));