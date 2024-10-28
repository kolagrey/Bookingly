-- Create migrations table
create table if not exists public.migrations (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  executed_at timestamptz not null default now()
);

-- Create function to run migrations
create or replace function run_migration(migration_sql text, migration_name text)
returns void
language plpgsql
security definer
as $$
begin
  execute migration_sql;
end;
$$;