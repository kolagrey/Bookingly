-- Create user_integrations table
create table public.user_integrations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) not null,
  provider text not null,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, provider)
);

-- Add RLS policies
alter table public.user_integrations enable row level security;

create policy "Users can only access their own integrations"
  on public.user_integrations for all
  using (auth.uid() = user_id);

-- Add buffer_time to experts table
alter table public.experts
  add column buffer_time integer not null default 15;

-- Add timezone to users table
alter table public.users
  add column timezone text not null default 'UTC';