insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'application-documents',
  'application-documents',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Applicants read their own documents" on storage.objects;
create policy "Applicants read their own documents"
on storage.objects for select to authenticated
using (
  bucket_id = 'application-documents'
  and exists (
    select 1 from public.applications a
    where a.id::text = split_part(name, '/', 1) and a.user_id = auth.uid()
  )
);

drop policy if exists "Administrators read applicant documents" on storage.objects;
create policy "Administrators read applicant documents"
on storage.objects for select to authenticated
using (
  bucket_id = 'application-documents'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "Applicants upload their own documents" on storage.objects;
create policy "Applicants upload their own documents"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'application-documents'
  and exists (
    select 1 from public.applications a
    where a.id::text = split_part(name, '/', 1) and a.user_id = auth.uid()
  )
);

drop policy if exists "Applicants delete their own documents" on storage.objects;
create policy "Applicants delete their own documents"
on storage.objects for delete to authenticated
using (
  bucket_id = 'application-documents'
  and exists (
    select 1 from public.applications a
    where a.id::text = split_part(name, '/', 1) and a.user_id = auth.uid()
  )
);
