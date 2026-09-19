begin;
create extension if not exists pgcrypto;
create schema if not exists private;
create table public.admin_users(user_id uuid primary key references auth.users(id) on delete cascade);
create function private.is_admin() returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.admin_users where user_id=auth.uid()); $$;
revoke all on function private.is_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;
create table public.profiles(id uuid primary key references auth.users(id) on delete cascade,settings jsonb not null default '{}'::jsonb,created_at timestamptz not null default now());
create table public.sources(
 id uuid primary key default gen_random_uuid(),name text not null,base_url text not null,
 terms_url text,robots_url text,license text,commercial_use text not null default 'unknown' check(commercial_use in ('allowed','denied','unknown')),
 collection_allowed boolean not null default false,raw_storage_allowed boolean not null default false,
 reviewed_at timestamptz,reviewed_by uuid references auth.users(id) on delete set null,notes text,
 min_interval_seconds integer not null default 86400 check(min_interval_seconds>=60)
);
create table public.source_documents(
 id uuid primary key default gen_random_uuid(),source_id uuid not null references public.sources(id),url text not null,
 published_at date,source_updated_at date,checked_at timestamptz not null default now(),sha256 text not null,
 unique(source_id,url,sha256)
);
create table public.schools(id text primary key,official_code text unique,name text not null,school_type text not null,region text not null,district text,reviewed boolean not null default false);
create table public.school_year_facts(id uuid primary key default gen_random_uuid(),school_id text not null references public.schools(id),academic_year integer not null check(academic_year between 2025 and 2040),students integer check(students>=0),curriculum jsonb not null default '[]',dormitory text,reviewed boolean not null default false,unique(school_id,academic_year));
create table public.universities(id text primary key,name text not null,homepage text,reviewed boolean not null default false);
create table public.departments(id text primary key,university_id text not null references public.universities(id),name text not null,field text,reviewed boolean not null default false);
create table public.subjects(id text primary key,name text not null,curriculum_version text not null,unique(name,curriculum_version));
create table public.admissions(id uuid primary key default gen_random_uuid(),school_id text references public.schools(id),department_id text references public.departments(id),academic_year integer not null,track text not null,details jsonb not null default '{}',reviewed boolean not null default false,check(num_nonnulls(school_id,department_id)=1));
create table public.subject_requirements(id uuid primary key default gen_random_uuid(),department_id text not null references public.departments(id),subject_id text not null references public.subjects(id),admission_id uuid references public.admissions(id),academic_year integer not null,kind text not null check(kind in ('required','recommended','evaluated')),reviewed boolean not null default false);
create table public.guides(id uuid primary key default gen_random_uuid(),title text not null,body text not null,kind text not null check(kind in ('official','expert','editorial')),academic_year integer,reviewed boolean not null default false);
create table public.events(id text primary key,title text not null,school_id text references public.schools(id),admission_id uuid references public.admissions(id),academic_year integer not null,starts_at timestamptz not null,ends_at timestamptz not null,time_zone text not null default 'Asia/Seoul',reviewed boolean not null default false,check(ends_at>=starts_at));

-- Versioned publication snapshots keep a reviewed page consistent during source updates.
create table public.catalog_entries(id text primary key,kind text not null check(kind in ('school','department','event')),academic_year integer not null,status text not null default 'draft' check(status in ('draft','published','withdrawn')),payload jsonb not null,updated_at timestamptz not null default now(),check(payload->>'id'=id),check((payload->'evidence'->>'year')::integer=academic_year));
create index catalog_year_kind on public.catalog_entries(academic_year,kind) where status='published';
create table public.record_evidence(id uuid primary key default gen_random_uuid(),entry_id text not null references public.catalog_entries(id) on delete cascade,document_id uuid not null references public.source_documents(id),page_number integer check(page_number>0),passage_locator text,unique(entry_id,document_id));
create table public.favorites(user_id uuid not null references auth.users(id) on delete cascade,entry_id text not null references public.catalog_entries(id) on delete cascade,created_at timestamptz not null default now(),primary key(user_id,entry_id));
create table public.saved_events(user_id uuid not null references auth.users(id) on delete cascade,entry_id text not null references public.catalog_entries(id) on delete cascade,created_at timestamptz not null default now(),primary key(user_id,entry_id));
create table public.notifications(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,entry_id text references public.catalog_entries(id) on delete cascade,title text not null,read boolean not null default false,created_at timestamptz not null default now());
create table public.collection_runs(id uuid primary key default gen_random_uuid(),source_id uuid references public.sources(id),started_at timestamptz not null default now(),finished_at timestamptz,status text not null check(status in ('running','blocked','unchanged','review','failed')),message text);
create table public.review_items(id uuid primary key default gen_random_uuid(),document_id uuid references public.source_documents(id),kind text not null check(kind in ('school','department','event')),payload jsonb not null,status text not null default 'pending' check(status in ('pending','approved','rejected')),created_at timestamptz not null default now(),reviewed_at timestamptz,reviewed_by uuid references auth.users(id) on delete set null);
create table public.audit_log(id uuid primary key default gen_random_uuid(),actor uuid,entity text not null,entity_id text not null,action text not null,old_value jsonb,new_value jsonb,created_at timestamptz not null default now());
create table public.affiliate_placements(id uuid primary key default gen_random_uuid(),label text not null,link_url text not null,banner_url text,disclosure text not null,approved boolean not null default false,reviewed_at timestamptz);

alter table public.admin_users enable row level security;
create policy admin_own on public.admin_users for select to authenticated using(user_id=auth.uid());
alter table public.profiles enable row level security;
create policy profile_own on public.profiles for all to authenticated using(id=auth.uid()) with check(id=auth.uid());
alter table public.catalog_entries enable row level security;
create policy published_catalog on public.catalog_entries for select to anon,authenticated using(status='published');
alter table public.record_evidence enable row level security;
create policy published_evidence on public.record_evidence for select to anon,authenticated using(exists(select 1 from public.catalog_entries c where c.id=entry_id and c.status='published'));
do $$ declare t text; begin
 foreach t in array array['favorites','saved_events'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('create policy own_read on public.%I for select to authenticated using(user_id=auth.uid())',t);
 execute format('create policy own_delete on public.%I for delete to authenticated using(user_id=auth.uid())',t);
 execute format('create policy own_insert on public.%I for insert to authenticated with check(user_id=auth.uid() and exists(select 1 from public.catalog_entries c where c.id=entry_id and c.status=''published'' %s))',t,case when t='saved_events' then 'and c.kind=''event''' else 'and c.kind in (''school'',''department'')' end);
 end loop;
 foreach t in array array['sources','source_documents','collection_runs','review_items','audit_log','affiliate_placements'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('create policy admin_read on public.%I for select to authenticated using(private.is_admin())',t);
 end loop;
 foreach t in array array['schools','school_year_facts','universities','departments','admissions','subject_requirements','guides','events'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('create policy approved_read on public.%I for select to anon,authenticated using(reviewed)',t);
 end loop;
end $$;
alter table public.subjects enable row level security;
create policy subject_read on public.subjects for select to anon,authenticated using(true);
alter table public.notifications enable row level security;
create policy note_read on public.notifications for select to authenticated using(user_id=auth.uid());
create policy note_update on public.notifications for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy admin_review_edit on public.review_items for update to authenticated using(private.is_admin() and status='pending') with check(private.is_admin() and status='pending');

revoke all on all tables in schema public from anon,authenticated;
grant select on public.catalog_entries,public.record_evidence,public.schools,public.school_year_facts,public.universities,public.departments,public.subjects,public.admissions,public.subject_requirements,public.guides,public.events to anon,authenticated;
grant select,insert,update,delete on public.profiles to authenticated;
grant select,insert,delete on public.favorites,public.saved_events to authenticated;
grant select on public.notifications,public.admin_users,public.sources,public.source_documents,public.collection_runs,public.review_items,public.audit_log,public.affiliate_placements to authenticated;
grant update(read) on public.notifications to authenticated;
grant update(payload) on public.review_items to authenticated;

create function private.audit_review() returns trigger language plpgsql security definer set search_path='' as $$ begin
 insert into public.audit_log(actor,entity,entity_id,action,old_value,new_value) values(auth.uid(),'review_items',new.id::text,'update',to_jsonb(old),to_jsonb(new));return new;end $$;
create trigger review_audit after update on public.review_items for each row execute function private.audit_review();
create function public.approve_review(review_id uuid) returns void language plpgsql security definer set search_path='' as $$
declare r public.review_items; d public.source_documents; src public.sources; eid text; yr integer; begin
 if not private.is_admin() then raise exception 'admin required';end if;
 select * into r from public.review_items where id=review_id for update;
 if not found or r.status<>'pending' then raise exception 'pending review required';end if;
 select * into d from public.source_documents where id=r.document_id;
 select * into src from public.sources where id=d.source_id;
 if src.id is null or not src.collection_allowed or src.commercial_use<>'allowed' or src.reviewed_at is null then raise exception 'source permission required';end if;
 if (r.payload->'evidence'->>'isDemo') is distinct from 'false' or r.payload->'evidence'->>'status' is distinct from 'reviewed' or nullif(r.payload->'evidence'->>'checkedAt','') is null or r.payload->'evidence'->>'sourceUrl' is distinct from d.url then raise exception 'verified evidence required';end if;
 eid=r.payload->>'id';yr=(r.payload->'evidence'->>'year')::integer;
 if eid is null or yr not between 2025 and 2040 then raise exception 'invalid publication';end if;
 insert into public.catalog_entries(id,kind,academic_year,status,payload) values(eid,r.kind,yr,'published',r.payload)
 on conflict(id) do update set kind=excluded.kind,academic_year=excluded.academic_year,status='published',payload=excluded.payload,updated_at=now();
 insert into public.record_evidence(entry_id,document_id) values(eid,d.id) on conflict do nothing;
 update public.review_items set status='approved',reviewed_at=now(),reviewed_by=auth.uid() where id=review_id;
 insert into public.notifications(user_id,entry_id,title)
 select user_id,eid,'관심 정보가 변경되었습니다: '||coalesce(r.payload->>'name',r.payload->>'title',eid) from
 (select user_id from public.favorites where entry_id=eid union select user_id from public.saved_events where entry_id=eid) users_to_notify;
end $$;
revoke all on function public.approve_review(uuid) from public;
grant execute on function public.approve_review(uuid) to authenticated;
commit;
