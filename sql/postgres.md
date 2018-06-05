#### create forign schema
```sql
REATE SCHEMA IF NOT EXISTS person;
CREATE EXTENSION  IF NOT EXISTS postgres_fdw;
SET search_path = $POSTGRES_USER,person,public;

DO LANGUAGE plpgsql \$$
BEGIN
  IF NOT EXISTS(select
				srvname
				from pg_foreign_server
				where srvname = 'postgres'
  )
  THEN
	CREATE SERVER postgres
		FOREIGN DATA WRAPPER postgres_fdw
		OPTIONS (host '$FOREIGN_HOST', port '5432', dbname 'eicur_zc');

	CREATE USER MAPPING FOR $POSTGRES_USER
		SERVER postgres
		OPTIONS (user '$POSTGRES_USER', password '$POSTGRES_PASSWORD');

	IMPORT FOREIGN SCHEMA public from server postgres  INTO public ;

	RETURN;
	END IF ;
END;
\$$;
```
#### copy tables
```sql
-- v1
CREATE TABLE <tablename>_copy (LIKE <tablename> INCLUDING ALL); -- copy table with columns
INSERT INTO <tablename>_copy SELECT * FROM <tablename>;

-- v2
select * into newtable from oldtable -- without index
select indexdef from pg_indexes where tablename='oldtable';  --copy index


-- function for copy

CREATE OR REPLACE FUNCTION table_to_file(text)
  RETURNS void AS
$delimeter$
BEGIN
  EXECUTE 'COPY (SELECT * FROM core_address) TO ''' || $1 || '''
'' ''';
END;
$delimeter$
LANGUAGE plpgsql
STRICT;

select table_to_file('/tmp/aaa.sql');

-- full version

CREATE OR REPLACE FUNCTION table_to_file(name text)
  RETURNS void AS
$delimeter$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN SELECT table_name
             FROM information_schema.tables
             WHERE table_schema = 'public' and table_catalog = name
                   and table_name NOT LIKE '%core_address%'
                   and table_name NOT LIKE '%msed%'
                   and table_name NOT LIKE '%goodness%'
                   and table_name NOT LIKE '%petition%'
  LOOP
    EXECUTE 'COPY (SELECT * FROM ' || rec.table_name || ') TO ''' || '/tmp/public/' || rec.table_name || '.sql''';
  END LOOP;
END;
$delimeter$
LANGUAGE plpgsql
STRICT;

-- DROP FUNCTION table_to_fil
select table_to_file('eicur_db');

```
#### reset pk sequence
```
ALTER SEQUENCE <tablename>_<id>_seq RESTART WITH 1
```

#### dump table
```
pg_dump --host localhost --port 5432 --username postgres 
--format plain --ignore-version --verbose --file "C:\temp\filename.backup" 
--table public.tablename dbname

# example
pg_dump --username eicur_zk --no-owner --verbose --file ./petitioner.sql --table petition_petitioner eicur_zk
```
#### load
```
psql -U username -d database -1 -f your_dump.sql
```

#### kill all sessions
```sql
SELECT 
    pg_terminate_backend(pid) 
FROM 
    pg_stat_activity 
WHERE 
    pid <> pg_backend_pid()
    AND datname = 'eicur_zk';
```
