#### dump table
```
pg_dump --host localhost --port 5432 --username postgres --format plain --ignore-version --verbose --file "C:\temp\filename.backup" --table public.tablename dbname
```
