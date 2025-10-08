-- allow OTP candidates to read their own invites; restrict inserts to admins only remains
alter table admin_invites enable row level security;

-- Candidate can select their own invite rows (to verify OTP)
drop policy if exists admin_invites_candidate_select on admin_invites;
create policy admin_invites_candidate_select on admin_invites
for select
using (
  candidate_email = (auth.jwt() ->> 'email')::text
);

-- Ensure only admins can insert/update/delete (previous policy kept)
-- If previous policy doesn't exist yet, re-assert here:
drop policy if exists admin_invites_admins_only on admin_invites;
create policy admin_invites_admins_only on admin_invites
for all
using (exists (select 1 from admins a where a.user_id = auth.uid()));
