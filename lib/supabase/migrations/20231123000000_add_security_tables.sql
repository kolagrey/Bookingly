-- Enable pgcrypto for encryption
create extension if not exists "pgcrypto";

-- Create audit_logs table
create table public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  action text not null,
  resource text not null,
  ip_address text not null,
  user_agent text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Add encryption functions
create or replace function encrypt_sensitive_data(data text, key text)
returns text
language plpgsql
security definer
as $$
begin
  return encode(
    encrypt_iv(
      data::bytea,
      key::bytea,
      '12345678'::bytea,
      'aes-cbc'
    ),
    'base64'
  );
end;
$$;

create or replace function decrypt_sensitive_data(encrypted_data text, key text)
returns text
language plpgsql
security definer
as $$
begin
  return convert_from(
    decrypt_iv(
      decode(encrypted_data, 'base64'),
      key::bytea,
      '12345678'::bytea,
      'aes-cbc'
    ),
    'utf8'
  );
end;
$$;

-- Add RLS policies
alter table public.audit_logs enable row level security;

create policy "Only admins can view audit logs"
  on public.audit_logs for select
  using (
    exists (
      select 1 from users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  );

-- Add trigger for sensitive data encryption
create trigger encrypt_sensitive_data_trigger
  before insert or update on users
  for each row
  execute function encrypt_sensitive_data_trigger();