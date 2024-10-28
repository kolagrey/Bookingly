create or replace function get_admin_stats()
returns json
language plpgsql
security definer
as $$
declare
  total_users integer;
  active_experts integer;
  total_bookings integer;
begin
  -- Get total users
  select count(*) into total_users from users;
  
  -- Get active experts (verified)
  select count(*) into active_experts 
  from experts 
  where verified = true;
  
  -- Get total bookings
  select count(*) into total_bookings 
  from bookings;
  
  return json_build_object(
    'totalUsers', total_users,
    'activeExperts', active_experts,
    'totalBookings', total_bookings
  );
end;
$$;