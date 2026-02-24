-- ============================================================
-- OSIS AP Project Management App — Supabase PostgreSQL Schema
-- ============================================================

-- 1. Projects table
create table if not exists projects (
  id             uuid        primary key default gen_random_uuid(),
  title          text        not null,
  description    text,
  deadline       timestamptz,
  category       text        check (category in ('Lomba', 'Tugas', 'Event')),
  attachment_url text,
  created_at     timestamptz default now()
);

-- 2. Function to generate submission IDs like 'AKT-XXXX'
create or replace function generate_submission_id()
returns text as $$
declare
  new_id text;
begin
  loop
    new_id := 'AKT-' || lpad(floor(random() * 10000)::int::text, 4, '0');
    exit when not exists (select 1 from submissions where id = new_id);
  end loop;
  return new_id;
end;
$$ language plpgsql;

-- 3. Submissions table
create table if not exists submissions (
  id              text        primary key default generate_submission_id(),
  project_id      uuid        references projects (id) on delete cascade,
  student_name    text        not null,
  student_class   text        not null,
  file_url        text,
  notes           text,
  status          text        default 'pending'
                              check (status in ('pending', 'approved', 'rejected')),
  points_awarded  int         default 0,
  submitted_at    timestamptz default now()
);

-- 4. Trigger: auto-generate submission id when not provided
create or replace function set_submission_id()
returns trigger as $$
begin
  if new.id is null or new.id = '' then
    new.id := generate_submission_id();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_set_submission_id
  before insert on submissions
  for each row
  execute function set_submission_id();

-- 5. Leaderboard table
create table if not exists leaderboard (
  id                      uuid primary key default gen_random_uuid(),
  student_name            text not null,
  student_class           text not null,
  total_score             int  default 0,
  approved_projects_count int  default 0
);

-- 6. Articles table
create table if not exists articles (
  id              uuid        primary key default gen_random_uuid(),
  title           text        not null,
  content         text,
  cover_image_url text,
  created_at      timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table projects    enable row level security;
alter table submissions enable row level security;
alter table leaderboard enable row level security;
alter table articles    enable row level security;

-- Projects: anyone can read and mutate (admin access is controlled by app middleware)
create policy "projects_select_all"  on projects for select using (true);
create policy "projects_insert_auth" on projects for insert to anon, authenticated with check (true);
create policy "projects_update_auth" on projects for update to anon, authenticated using (true) with check (true);
create policy "projects_delete_auth" on projects for delete to anon, authenticated using (true);

-- Submissions: anyone can read, insert, update, and delete (admin access is controlled by app middleware)
create policy "submissions_select_all"  on submissions for select using (true);
create policy "submissions_insert_all"  on submissions for insert to anon, authenticated with check (true);
create policy "submissions_update_auth" on submissions for update to anon, authenticated using (true) with check (true);
create policy "submissions_delete_auth" on submissions for delete to anon, authenticated using (true);

-- Leaderboard: anyone can read and mutate (admin access is controlled by app middleware)
create policy "leaderboard_select_all"  on leaderboard for select using (true);
create policy "leaderboard_insert_auth" on leaderboard for insert to anon, authenticated with check (true);
create policy "leaderboard_update_auth" on leaderboard for update to anon, authenticated using (true) with check (true);
create policy "leaderboard_delete_auth" on leaderboard for delete to anon, authenticated using (true);

-- Articles: anyone can read and mutate (admin access is controlled by app middleware)
create policy "articles_select_all"  on articles for select using (true);
create policy "articles_insert_auth" on articles for insert to anon, authenticated with check (true);
create policy "articles_update_auth" on articles for update to anon, authenticated using (true) with check (true);
create policy "articles_delete_auth" on articles for delete to anon, authenticated using (true);

-- ============================================================
-- Storage bucket: 'attachments'
-- ============================================================
-- Create the bucket via Supabase dashboard or with:
--   insert into storage.buckets (id, name, public) values ('attachments', 'attachments', true);
--
-- Recommended storage policies (allow public access since admin access is controlled by app middleware):
--   • SELECT (download): allow all users  → using (true)
--   • INSERT (upload):   allow all users  → with check (true)
--   • DELETE:            allow all users  → using (true)
