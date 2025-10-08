-- admins
create table if not exists admins (
  user_id uuid primary key,
  email text not null unique,
  name text,
  created_by uuid,
  created_at timestamptz default now()
);

-- admin_invites (OTP goes to approver email to approve candidate)
create table if not exists admin_invites (
  id bigserial primary key,
  candidate_email text not null,
  approver_email text not null,
  code text not null,
  expires_at timestamptz not null,
  invited_by uuid not null,
  used_at timestamptz,
  created_at timestamptz default now()
);

-- notes (Drive-like files)
create table if not exists notes (
  id bigserial primary key,
  owner_id uuid not null,
  title text not null,
  storage_path text not null unique,
  size bigint,
  views_count bigint default 0,
  downloads_count bigint default 0,
  created_at timestamptz default now()
);

-- ACL: share by email (viewer/editor)
create table if not exists notes_acl (
  id bigserial primary key,
  note_id bigint not null references notes(id) on delete cascade,
  grantee_email text not null,
  permission text not null check (permission in ('viewer','editor')),
  created_at timestamptz default now(),
  unique (note_id, grantee_email)
);

-- Storage bucket (create manually in Supabase dashboard or via API); name: "notes"
-- In code, we assume a private bucket called "notes".

-- helper function to increment downloads atomically
create or replace function increment_downloads(p_note_id bigint)
returns void
language plpgsql
as $$
begin
  update notes set downloads_count = downloads_count + 1 where id = p_note_id;
end; $$;
