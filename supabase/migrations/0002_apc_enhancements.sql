-- Enhance users table for APC-specific fields
alter table users
  add column if not exists apc_route text,
  add column if not exists rics_enrollment_date date,
  add column if not exists rics_membership_number text,
  add column if not exists counsellor_name text,
  add column if not exists counsellor_email text,
  add column if not exists supervisor_name text,
  add column if not exists supervisor_email text,
  add column if not exists target_submission_date date,
  add column if not exists academic_qualification text,
  add column if not exists years_of_experience numeric default 0;

-- Create user_competencies table to track individual competency progress
create table if not exists user_competencies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  competency_id uuid references competencies(id) on delete cascade,
  current_level int default 0 check (current_level between 0 and 3),
  achieved_level int default 0 check (achieved_level between 0 and 3),
  evidence_count int default 0,
  last_updated timestamptz default timezone('utc', now()),
  supervisor_signoff boolean default false,
  counsellor_signoff boolean default false,
  signoff_date timestamptz,
  created_at timestamptz default timezone('utc', now()),
  unique(user_id, competency_id)
);

-- Create case_studies table
create table if not exists case_studies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  title text not null,
  overview text,
  role_responsibilities text,
  key_issues text,
  problem_solving text,
  outcomes text,
  lessons_learned text,
  word_count int default 0,
  status text check (status in ('draft','in-review','approved','submitted')),
  presentation_notes text,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- Create summary_of_experience table
create table if not exists summary_of_experience (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  competency_id text not null,
  competency_name text not null,
  content text not null,
  word_count int default 0,
  level int check (level between 1 and 3),
  version int default 1,
  status text check (status in ('draft','in-review','approved','submitted')),
  ai_suggestions jsonb default '[]'::jsonb,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- Create interview_prep table
create table if not exists interview_prep (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  question text not null,
  answer text,
  competency_area text,
  level int check (level between 1 and 3),
  question_type text check (question_type in ('competency','ethics','technical','scenario')),
  star_format jsonb,
  feedback text,
  rating int check (rating between 1 and 5),
  created_at timestamptz default timezone('utc', now())
);

-- Create document_versions table for version control
create table if not exists document_versions (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid references documents(id) on delete cascade,
  version_number int not null,
  content text not null,
  changes_summary text,
  reviewed_by uuid references users(id) on delete set null,
  review_status text check (review_status in ('pending','approved','rejected','changes-requested')),
  review_comments text,
  created_at timestamptz default timezone('utc', now())
);

-- Create document_comments table for collaboration
create table if not exists document_comments (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid references documents(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  comment_text text not null,
  line_reference text,
  resolved boolean default false,
  created_at timestamptz default timezone('utc', now())
);

-- Create cpd_annual_tracker table
create table if not exists cpd_annual_tracker (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  year int not null,
  total_hours numeric default 0,
  formal_hours numeric default 0,
  informal_hours numeric default 0,
  structured_hours numeric default 0,
  target_hours numeric default 48,
  created_at timestamptz default timezone('utc', now()),
  unique(user_id, year)
);

-- Create progress_milestones table
create table if not exists progress_milestones (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  milestone_type text not null,
  title text not null,
  description text,
  target_date date,
  completed_date date,
  status text check (status in ('pending','in-progress','completed','overdue')),
  created_at timestamptz default timezone('utc', now())
);

-- Add indexes for performance
create index if not exists idx_user_competencies_user_id on user_competencies(user_id);
create index if not exists idx_user_competencies_competency_id on user_competencies(competency_id);
create index if not exists idx_case_studies_user_id on case_studies(user_id);
create index if not exists idx_summary_of_experience_user_id on summary_of_experience(user_id);
create index if not exists idx_experience_entries_user_id on experience_entries(user_id);
create index if not exists idx_cpd_activities_user_id on cpd_activities(user_id);
create index if not exists idx_cpd_annual_tracker_user_id on cpd_annual_tracker(user_id);

