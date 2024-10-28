-- Enable PostgreSQL extensions
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users(id) primary key,
  role text not null check (role in ('client', 'expert', 'admin')),
  full_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Experts table
create table public.experts (
  user_id uuid primary key references public.users(id),
  expertise text[] not null default '{}',
  hourly_rate numeric not null check (hourly_rate >= 0),
  bio text,
  verified boolean not null default false,
  rating numeric not null default 0 check (rating >= 0 and rating <= 5),
  total_reviews integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Availability schedules
create table public.availability_schedules (
  expert_id uuid references public.experts(user_id) primary key,
  weekday_schedule jsonb not null default '[]',
  exceptions jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Bookings
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  expert_id uuid not null references public.experts(user_id),
  client_id uuid not null references public.users(id),
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status text not null check (payment_status in ('pending', 'paid', 'refunded', 'failed')),
  amount numeric not null check (amount >= 0),
  currency text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Reviews
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references public.bookings(id),
  client_id uuid not null references public.users(id),
  expert_id uuid not null references public.experts(user_id),
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS Policies
alter table public.users enable row level security;
alter table public.experts enable row level security;
alter table public.availability_schedules enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;

-- Functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, role, full_name, avatar_url)
  values (new.id, 'client', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();