-- Create contact_submissions table
create table public.contact_submissions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  topic text not null,
  message text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  processed_at timestamptz,
  resolved_at timestamptz
);

-- Add RLS policies
alter table public.contact_submissions enable row level security;

create policy "Only admins can view contact submissions"
  on public.contact_submissions for select
  using (
    exists (
      select 1 from users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  );

create policy "Anyone can insert contact submissions"
  on public.contact_submissions for insert
  with check (true);