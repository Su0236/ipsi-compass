begin;

-- Only signed-in users can reach the function; the function still checks admin_users.
revoke execute on function public.approve_review(uuid) from anon;
grant execute on function public.approve_review(uuid) to authenticated;

commit;
