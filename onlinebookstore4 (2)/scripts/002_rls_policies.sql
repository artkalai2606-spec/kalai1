-- Enable RLS
alter table admins enable row level security;
alter table admin_invites enable row level security;
alter table notes enable row level security;
alter table notes_acl enable row level security;

-- Admins: a user can see their own admin record; existing admins can see all admins
drop policy if exists admins_self_select on admins;
create policy admins_self_select on admins
for select using (auth.uid() = user_id);

drop policy if exists admins_manage on admins;
create policy admins_manage on admins
for all
using (exists (select 1 from admins a where a.user_id = auth.uid()));

-- Admin invites: only admins can insert/select/update
drop policy if exists admin_invites_admins_only on admin_invites;
create policy admin_invites_admins_only on admin_invites
for all
using (exists (select 1 from admins a where a.user_id = auth.uid()));

-- Notes: owner can do everything
drop policy if exists notes_owner_all on notes;
create policy notes_owner_all on notes
for all using (owner_id = auth.uid());

-- Notes select: allow if owner OR email is shared in ACL
drop policy if exists notes_shared_select on notes;
create policy notes_shared_select on notes
for select using (
  owner_id = auth.uid()
  or exists (
    select 1 from notes_acl acl
    where acl.note_id = notes.id
      and acl.grantee_email = (auth.jwt() ->> 'email')::text
  )
);

-- ACL: only owner of the note can manage acl entries
drop policy if exists acl_owner_manage on notes_acl;
create policy acl_owner_manage on notes_acl
for all using (
 exists (select 1 from notes n where n.id = notes_acl.note_id and n.owner_id = auth.uid())
);

-- Function execution: allow increment_downloads only when user can select the note
-- (RLS on notes applies to the update; ensure caller has select access)
