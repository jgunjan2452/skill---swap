-- Skill Swap production schema for Supabase. Run once in Supabase SQL Editor.
-- The public anon key is designed to be exposed in browser apps; these RLS rules are the security boundary.
begin;

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 50),
  location text check (location is null or char_length(location) <= 80),
  region text check (region is null or char_length(region) <= 80),
  bio text not null check (char_length(trim(bio)) between 1 and 280),
  avatar_url text check (avatar_url is null or char_length(avatar_url) <= 400),
  meetup_preference text not null default 'Online' check (meetup_preference in ('Online','In person','Both')),
  teach_skills jsonb not null default '[]'::jsonb check (jsonb_typeof(teach_skills) = 'array' and jsonb_array_length(teach_skills) between 1 and 12),
  learn_skills jsonb not null default '[]'::jsonb check (jsonb_typeof(learn_skills) = 'array' and jsonb_array_length(learn_skills) between 1 and 12),
  learning_goal text not null default 'Build a project' check (char_length(learning_goal) <= 60),
  learning_style text not null default 'Project-based' check (char_length(learning_style) <= 60),
  languages jsonb not null default '[]'::jsonb check (jsonb_typeof(languages) = 'array'),
  availability text check (availability is null or char_length(availability) <= 120),
  timezone text check (timezone is null or char_length(timezone) <= 60),
  weekly_time text check (weekly_time is null or weekly_time in ('1–2 hours','3–5 hours','6+ hours')),
  experience_level text not null default 'Beginner' check (experience_level in ('Beginner','Intermediate','Advanced')),
  beginner_friendly boolean not null default false,
  structured_learning boolean not null default false,
  pair_programming boolean not null default false,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint blocks_not_self check (blocker_id <> blocked_id),
  constraint blocks_unique_pair unique (blocker_id, blocked_id)
);

create table if not exists public.swap_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  proposal text not null check (char_length(trim(proposal)) between 1 and 500),
  introduction text check (introduction is null or char_length(introduction) <= 300),
  status text not null default 'pending' check (status in ('pending','accepted','declined','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  pair_low uuid generated always as (least(sender_id,recipient_id)) stored,
  pair_high uuid generated always as (greatest(sender_id,recipient_id)) stored,
  constraint swap_request_not_self check (sender_id <> recipient_id)
);
create unique index if not exists swap_requests_one_active_pair on public.swap_requests(pair_low,pair_high) where status in ('pending','accepted');
create index if not exists swap_requests_sender_idx on public.swap_requests(sender_id,status,created_at desc);
create index if not exists swap_requests_recipient_idx on public.swap_requests(recipient_id,status,created_at desc);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.swap_requests(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists messages_request_created_idx on public.messages(request_id,created_at);

create table if not exists public.message_reads (
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key(message_id,user_id)
);

-- Public community activity: coding notes, project ideas, helpful reactions and practice days.
create table if not exists public.community_notes (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 220),
  created_at timestamptz not null default now()
);
create index if not exists community_notes_created_idx on public.community_notes(created_at desc);
create table if not exists public.community_note_reactions (
  note_id uuid not null references public.community_notes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(note_id,user_id)
);
create table if not exists public.practice_days (
  user_id uuid not null references auth.users(id) on delete cascade,
  practice_date date not null default current_date,
  created_at timestamptz not null default now(),
  primary key(user_id,practice_date)
);
create table if not exists public.project_ideas (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 70),
  description text not null check (char_length(trim(description)) between 1 and 280),
  looking_for text not null check (looking_for in ('Any collaborators','Frontend partner','Backend partner','Design partner','Learning buddy')),
  created_at timestamptz not null default now()
);
create index if not exists project_ideas_created_idx on public.project_ideas(created_at desc);
create table if not exists public.project_idea_votes (
  idea_id uuid not null references public.project_ideas(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(idea_id,user_id)
);

create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists swap_requests_updated_at on public.swap_requests;
create trigger swap_requests_updated_at before update on public.swap_requests for each row execute function public.set_updated_at();

-- Security-definer helper functions avoid exposing block rows while checking a pair.
create or replace function public.is_blocked_between(a uuid,b uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.blocks x where (x.blocker_id=a and x.blocked_id=b) or (x.blocker_id=b and x.blocked_id=a));
$$;
revoke all on function public.is_blocked_between(uuid,uuid) from public, anon;
grant execute on function public.is_blocked_between(uuid,uuid) to authenticated;

-- Request rows may only be created as pending. Participants can accept/decline/close,
-- but cannot rewrite who sent the request or its original proposal.
create or replace function public.guard_swap_request_update() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    if new.sender_id <> auth.uid() or new.status <> 'pending' then raise exception 'A request must be sent by the signed-in user as pending.'; end if;
    if public.is_blocked_between(new.sender_id,new.recipient_id) then raise exception 'This connection is unavailable.'; end if;
    if (select count(*) from public.swap_requests r where r.sender_id = new.sender_id and r.created_at > now() - interval '10 minutes') >= 5 then raise exception 'Request limit reached. Please wait a few minutes before sending another.'; end if;
    return new;
  end if;
  if new.sender_id <> old.sender_id or new.recipient_id <> old.recipient_id or new.proposal <> old.proposal or new.introduction is distinct from old.introduction or new.id <> old.id then
    raise exception 'Request details cannot be changed after sending.';
  end if;
  if old.status = 'pending' and auth.uid() = old.recipient_id and new.status in ('accepted','declined') then return new; end if;
  if old.status = 'pending' and auth.uid() = old.sender_id and new.status = 'closed' then return new; end if;
  if old.status = 'accepted' and auth.uid() in (old.sender_id,old.recipient_id) and new.status = 'closed' then return new; end if;
  raise exception 'This request status change is not allowed.';
end; $$;
drop trigger if exists swap_requests_guard on public.swap_requests;
create trigger swap_requests_guard before insert or update on public.swap_requests for each row execute function public.guard_swap_request_update();

alter table public.profiles enable row level security;
alter table public.blocks enable row level security;
alter table public.swap_requests enable row level security;
alter table public.messages enable row level security;
alter table public.message_reads enable row level security;
alter table public.community_notes enable row level security;
alter table public.community_note_reactions enable row level security;
alter table public.practice_days enable row level security;
alter table public.project_ideas enable row level security;
alter table public.project_idea_votes enable row level security;

drop policy if exists community_notes_public_read on public.community_notes;
create policy community_notes_public_read on public.community_notes for select to anon,authenticated using (true);
drop policy if exists community_notes_insert_public_profile on public.community_notes;
create policy community_notes_insert_public_profile on public.community_notes for insert to authenticated with check (author_id=(select auth.uid()) and exists(select 1 from public.profiles p where p.id=author_id and p.is_public));
drop policy if exists community_notes_delete_self on public.community_notes;
create policy community_notes_delete_self on public.community_notes for delete to authenticated using (author_id=(select auth.uid()));
drop policy if exists note_reactions_read on public.community_note_reactions;
create policy note_reactions_read on public.community_note_reactions for select to anon,authenticated using (true);
drop policy if exists note_reactions_insert_self on public.community_note_reactions;
create policy note_reactions_insert_self on public.community_note_reactions for insert to authenticated with check (user_id=(select auth.uid()));
drop policy if exists note_reactions_delete_self on public.community_note_reactions;
create policy note_reactions_delete_self on public.community_note_reactions for delete to authenticated using (user_id=(select auth.uid()));
drop policy if exists practice_days_read_self on public.practice_days;
create policy practice_days_read_self on public.practice_days for select to authenticated using (user_id=(select auth.uid()));
drop policy if exists practice_days_insert_today on public.practice_days;
create policy practice_days_insert_today on public.practice_days for insert to authenticated with check (user_id=(select auth.uid()) and practice_date=current_date);
drop policy if exists project_ideas_public_read on public.project_ideas;
create policy project_ideas_public_read on public.project_ideas for select to anon,authenticated using (true);
drop policy if exists project_ideas_insert_public_profile on public.project_ideas;
create policy project_ideas_insert_public_profile on public.project_ideas for insert to authenticated with check (author_id=(select auth.uid()) and exists(select 1 from public.profiles p where p.id=author_id and p.is_public));
drop policy if exists project_ideas_delete_self on public.project_ideas;
create policy project_ideas_delete_self on public.project_ideas for delete to authenticated using (author_id=(select auth.uid()));
drop policy if exists project_idea_votes_read on public.project_idea_votes;
create policy project_idea_votes_read on public.project_idea_votes for select to anon,authenticated using (true);
drop policy if exists project_idea_votes_insert_self on public.project_idea_votes;
create policy project_idea_votes_insert_self on public.project_idea_votes for insert to authenticated with check (user_id=(select auth.uid()));
drop policy if exists project_idea_votes_delete_self on public.project_idea_votes;
create policy project_idea_votes_delete_self on public.project_idea_votes for delete to authenticated using (user_id=(select auth.uid()));

drop policy if exists profiles_public_or_owner_read on public.profiles;
create policy profiles_public_or_owner_read on public.profiles for select to anon, authenticated using (is_public or id = (select auth.uid()));
drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles for insert to authenticated with check (id = (select auth.uid()));
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
drop policy if exists profiles_delete_self on public.profiles;
create policy profiles_delete_self on public.profiles for delete to authenticated using (id = (select auth.uid()));

drop policy if exists blocks_read_participant on public.blocks;
create policy blocks_read_participant on public.blocks for select to authenticated using (blocker_id = (select auth.uid()) or blocked_id = (select auth.uid()));
drop policy if exists blocks_insert_self on public.blocks;
create policy blocks_insert_self on public.blocks for insert to authenticated with check (blocker_id = (select auth.uid()) and blocked_id <> (select auth.uid()));
drop policy if exists blocks_delete_self on public.blocks;
create policy blocks_delete_self on public.blocks for delete to authenticated using (blocker_id = (select auth.uid()));

drop policy if exists requests_read_participant on public.swap_requests;
create policy requests_read_participant on public.swap_requests for select to authenticated using (
  (sender_id = (select auth.uid()) or recipient_id = (select auth.uid())) and not public.is_blocked_between(sender_id,recipient_id)
);
drop policy if exists requests_insert_sender on public.swap_requests;
create policy requests_insert_sender on public.swap_requests for insert to authenticated with check (
  sender_id = (select auth.uid()) and status = 'pending' and not public.is_blocked_between(sender_id,recipient_id)
  and exists(select 1 from public.profiles p where p.id = recipient_id and p.is_public = true)
);
drop policy if exists requests_update_participant on public.swap_requests;
create policy requests_update_participant on public.swap_requests for update to authenticated using (
  (sender_id = (select auth.uid()) or recipient_id = (select auth.uid())) and not public.is_blocked_between(sender_id,recipient_id)
) with check (
  (sender_id = (select auth.uid()) or recipient_id = (select auth.uid())) and not public.is_blocked_between(sender_id,recipient_id)
);

drop policy if exists messages_read_accepted on public.messages;
create policy messages_read_accepted on public.messages for select to authenticated using (
  exists(select 1 from public.swap_requests r where r.id = request_id and r.status = 'accepted'
    and (r.sender_id = (select auth.uid()) or r.recipient_id = (select auth.uid()))
    and not public.is_blocked_between(r.sender_id,r.recipient_id))
);
drop policy if exists messages_insert_accepted on public.messages;
create policy messages_insert_accepted on public.messages for insert to authenticated with check (
  sender_id = (select auth.uid()) and exists(select 1 from public.swap_requests r where r.id = request_id and r.status = 'accepted'
    and (r.sender_id = (select auth.uid()) or r.recipient_id = (select auth.uid()))
    and not public.is_blocked_between(r.sender_id,r.recipient_id))
);

drop policy if exists reads_read_self on public.message_reads;
create policy reads_read_self on public.message_reads for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists reads_insert_for_received_message on public.message_reads;
create policy reads_insert_for_received_message on public.message_reads for insert to authenticated with check (
  user_id = (select auth.uid()) and exists(select 1 from public.messages m join public.swap_requests r on r.id=m.request_id
    where m.id=message_id and m.sender_id <> (select auth.uid()) and r.status='accepted'
    and (r.sender_id=(select auth.uid()) or r.recipient_id=(select auth.uid()))
    and not public.is_blocked_between(r.sender_id,r.recipient_id))
);

-- Users can delete their own account through the authenticated app. Cascades remove profile,
-- requests, chats, reads and blocks. This function does not use the service-role key.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'You must be signed in.'; end if;
  delete from auth.users where id = auth.uid();
end; $$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

grant select on public.profiles to anon;
grant select,insert,update,delete on public.profiles to authenticated;
grant select,insert,delete on public.blocks to authenticated;
grant select,insert,update on public.swap_requests to authenticated;
grant select,insert on public.messages to authenticated;
grant select,insert on public.message_reads to authenticated;
grant select,insert,delete on public.community_notes to authenticated;
grant select on public.community_notes to anon;
grant select,insert,delete on public.community_note_reactions to authenticated;
grant select on public.community_note_reactions to anon;
grant select,insert on public.practice_days to authenticated;
grant select,insert,delete on public.project_ideas to authenticated;
grant select on public.project_ideas to anon;
grant select,insert,delete on public.project_idea_votes to authenticated;
grant select on public.project_idea_votes to anon;

-- Enable Realtime for chats. Safe to run again if the table is already in the publication.
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='messages') then
    alter publication supabase_realtime add table public.messages;
  end if;
exception when undefined_object then null;
end $$;

commit;
