create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text,
  current_level text check (current_level in ('student','associate','member','senior','academic','fellow')),
  target_level text,
  pathway text,
  organisation_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists qualifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  degree_type text,
  institution text,
  accreditation_status text,
  graduation_year int,
  documents jsonb default '[]'::jsonb,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  client text,
  contract_value numeric,
  role text,
  competencies text[],
  lessons_learned text,
  start_date date,
  end_date date,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists experience_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  entry_date date not null,
  description text,
  competencies text[],
  level int check (level between 1 and 3),
  hours numeric default 0,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists competencies (
  id uuid primary key default uuid_generate_v4(),
  pathway text,
  name text not null,
  type text check (type in ('mandatory','core','optional')),
  required_level int,
  current_level int default 0,
  evidence jsonb default '[]'::jsonb,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists cpd_activities (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  activity_date date,
  type text check (type in ('formal','informal','structured')),
  hours numeric,
  description text,
  competency_links text[],
  certificate_url text,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists assessments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  route text,
  status text,
  submission_date date,
  result text,
  feedback jsonb,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  type text,
  version text,
  content text,
  approval_status text,
  metadata jsonb,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists mentorship (
  id uuid primary key default uuid_generate_v4(),
  counsellor_id uuid references users(id) on delete cascade,
  mentee_id uuid references users(id) on delete cascade,
  meetings jsonb default '[]'::jsonb,
  feedback jsonb,
  status text,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists fellowship_characteristics (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  category text,
  description text,
  evidence jsonb,
  created_at timestamptz default timezone('utc', now())
);
