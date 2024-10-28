-- Add new fields to users table
alter table public.users
  add column location text,
  add column timezone text not null default 'UTC',
  add column preferred_currency text not null default 'USD';

-- Add social links to experts table
alter table public.experts
  add column portfolio_url text,
  add column linkedin_url text,
  add column twitter_handle text,
  add column instagram_handle text;

-- Create storage bucket for profile photos
insert into storage.buckets (id, name)
values ('profile-photos', 'profile-photos');

-- Add storage policies
create policy "Users can upload their own profile photo"
  on storage.objects for insert
  with check (
    bucket_id = 'profile-photos' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Anyone can view profile photos"
  on storage.objects for select
  using (bucket_id = 'profile-photos');

-- Add function to optimize and process profile photos
create or replace function process_profile_photo()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Update user's avatar_url
  update users
  set avatar_url = storage.get_public_url(new.name)
  where id = auth.uid();
  
  return new;
end;
$$;

-- Add trigger for photo processing
create trigger on_profile_photo_uploaded
  after insert on storage.objects
  for each row
  when (new.bucket_id = 'profile-photos')
  execute function process_profile_photo();