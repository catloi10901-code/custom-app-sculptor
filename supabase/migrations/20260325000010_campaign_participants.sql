-- Table to track users who joined campaigns
create table if not exists public.campaign_participants (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique(campaign_id, user_id)
);

alter table public.campaign_participants enable row level security;

create policy "Anyone can read campaign participants" on public.campaign_participants
  for select using (true);

create policy "Authenticated users can join campaigns" on public.campaign_participants
  for insert with check (auth.uid() = user_id);

create policy "Users can leave campaigns" on public.campaign_participants
  for delete using (auth.uid() = user_id);

-- Trigger to keep campaigns.participants count in sync
create or replace function public.update_campaign_participants_count()
returns trigger language plpgsql security definer as $$
begin
  if (TG_OP = 'INSERT') then
    update public.campaigns set participants = participants + 1 where id = NEW.campaign_id;
  elsif (TG_OP = 'DELETE') then
    update public.campaigns set participants = participants - 1 where id = OLD.campaign_id;
  end if;
  return null;
end;
$$;

create trigger campaign_participants_count_trigger
after insert or delete on public.campaign_participants
for each row execute function public.update_campaign_participants_count();
