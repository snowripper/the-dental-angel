-- Create conversations table
create table conversations (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  preview text,
  messages jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table conversations enable row level security;

-- Create policy: users can only see their own conversations
create policy "Users can view own conversations"
  on conversations for select
  using (auth.uid() = user_id);

-- Create policy: users can insert their own conversations
create policy "Users can insert own conversations"
  on conversations for insert
  with check (auth.uid() = user_id);

-- Create policy: users can update their own conversations
create policy "Users can update own conversations"
  on conversations for update
  using (auth.uid() = user_id);

-- Create policy: users can delete their own conversations
create policy "Users can delete own conversations"
  on conversations for delete
  using (auth.uid() = user_id);
