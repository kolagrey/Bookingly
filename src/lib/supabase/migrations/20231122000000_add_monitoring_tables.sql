-- Create system_events table
create table public.system_events (
  id uuid primary key default uuid_generate_v4(),
  type text not null,
  user_id uuid references auth.users(id),
  details jsonb,
  status text not null,
  created_at timestamptz not null default now()
);

-- Create analytics functions
create or replace function get_booking_analytics(time_range text)
returns json
language plpgsql
security definer
as $$
declare
  result json;
begin
  with daily_stats as (
    select
      date_trunc('day', created_at) as date,
      count(*) as value
    from bookings
    where created_at >= now() - time_range::interval
    group by date_trunc('day', created_at)
    order by date_trunc('day', created_at)
  )
  select json_agg(row_to_json(daily_stats))
  into result
  from daily_stats;
  
  return result;
end;
$$;

create or replace function get_revenue_analytics(time_range text)
returns json
language plpgsql
security definer
as $$
declare
  result json;
begin
  with daily_stats as (
    select
      date_trunc('day', created_at) as date,
      sum(amount) as value
    from bookings
    where created_at >= now() - time_range::interval
    group by date_trunc('day', created_at)
    order by date_trunc('day', created_at)
  )
  select json_agg(row_to_json(daily_stats))
  into result
  from daily_stats;
  
  return result;
end;
$$;

-- Add RLS policies
alter table public.system_events enable row level security;

create policy "Only admins can view system events"
  on public.system_events for select
  using (
    exists (
      select 1
      from users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  );