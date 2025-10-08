-- add a function to increment views atomically
create or replace function increment_views(p_note_id bigint)
returns void
language plpgsql
as $$
begin
  update notes set views_count = views_count + 1 where id = p_note_id;
end; $$;
