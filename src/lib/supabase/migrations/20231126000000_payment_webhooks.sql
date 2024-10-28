-- Add payment-related fields to bookings table
alter table public.bookings
  add column stripe_payment_intent text,
  add column stripe_payment_id text,
  add column paystack_reference text,
  add column refund_id text,
  add column refund_reference text,
  add column dispute_id text,
  add column dispute_status text;

-- Add indexes for faster webhook processing
create index bookings_stripe_payment_intent_idx 
  on public.bookings(stripe_payment_intent);

create index bookings_stripe_payment_id_idx 
  on public.bookings(stripe_payment_id);

create index bookings_paystack_reference_idx 
  on public.bookings(paystack_reference);

-- Add webhook events table for audit
create table public.webhook_events (
  id uuid primary key default uuid_generate_v4(),
  provider text not null,
  event_type text not null,
  event_id text not null,
  payload jsonb not null,
  processed_at timestamptz not null default now(),
  status text not null default 'success',
  error_message text
);

-- Add RLS policies
alter table public.webhook_events enable row level security;

create policy "Only admins can view webhook events"
  on public.webhook_events for select
  using (
    exists (
      select 1 from users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  );