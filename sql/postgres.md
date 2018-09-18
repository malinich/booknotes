#### list indexes
```sql
select *
from pg_indexes
where tablename not like 'pg%';
```

#### гранты permissions
```sql
SELECT grantee
      ,table_catalog
      ,table_schema
      ,table_name
      ,string_agg(privilege_type, ', ' ORDER BY privilege_type) AS privileges
FROM information_schema.role_table_grants
WHERE grantee != 'postgres'
--  and table_catalog = 'somedatabase' /* uncomment line to filter database */
--  and table_schema  = 'someschema'   /* uncomment line to filter schema  */
--  and table_name    = 'sometable'    /* uncomment line to filter table  */
GROUP BY 1, 2, 3, 4;
```

#### owner tables
```sql
select
  t.table_name,
  t.table_type,
  c.relname,
  c.relowner,
  u.usename
from information_schema.tables t
  join pg_catalog.pg_class c on (t.table_name = c.relname)
  join pg_catalog.pg_user u on (c.relowner = u.usesysid)
where t.table_schema = 'public'
```
#### owner db
```sql
SELECT d.datname as "Name",
    pg_catalog.pg_get_userbyid(d.datdba) as "Owner"
FROM pg_catalog.pg_database d
WHERE d.datname = 'your_name'
ORDER BY 1;
```
#### random row
```sql
SELECT *
FROM  (
    SELECT DISTINCT 1 + trunc(random() * 35000)::integer AS id
    FROM   generate_series(1, 1100) g
    ) r
JOIN public.ad_subject  USING (id)
LIMIT  1;
```
#### iterator

```sql
CREATE OR REPLACE FUNCTION random_range(INTEGER, INTEGER)
  RETURNS INTEGER
LANGUAGE SQL
AS $$
SELECT ($1 + FLOOR(($2 - $1 + 1) * random())) :: INTEGER;
$$;


DO
$$
DECLARE
  possible_chars TEXT := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  n              INTEGER := 35000; -- int, not bigint!
  pos            INT4;
BEGIN
  while n > 0 loop
    pos := random_range(1, length(possible_chars));
    INSERT INTO public.ntfs_ace (is_last,
                                 effective_from,
                                 effective_to,
                                 last_sync,
                                 change_type,
                                 event_record_id,
                                 changed_by,
                                 subj_id,
                                 obj,
                                 login,
                                 permissions,
                                 ace_type,
                                 inheritance,
                                 source_id,
                                 subject_type)
    VALUES (true,
            '2018-08-15 15:32:10.270000',
            '2099-12-31 00:00:00.000000',
            '2018-08-15 15:32:10.270000',
            2,
            null,
            null,
            'S-1-5-32-544',
            'soft\Vagrant' || substr(possible_chars, pos, 1),
            'BUILTIN\Администраторы',
            2032127,
            0,
            19,
            2,
            4);
    n := (n - 1);

    raise notice '%', n;
  end loop;
END
```

#### all permissions
```sql
SELECT grantee
      ,table_catalog
      ,table_schema
      ,table_name
      ,string_agg(privilege_type, ', ' ORDER BY privilege_type) AS privileges
FROM information_schema.role_table_grants 
WHERE grantee != 'postgres' 
--  and table_catalog = 'somedatabase' /* uncomment line to filter database */
--  and table_schema  = 'someschema'   /* uncomment line to filter schema  */
--  and table_name    = 'sometable'    /* uncomment line to filter table  */
GROUP BY 1, 2, 3, 4;

```
#### update one column from table
```sql
select table_to_file('/tmp/incident_incident.sql'); -- function see below

CREATE TEMP TABLE tmp AS SELECT * FROM incident_incident;
COPY tmp(id, petition_source)  from '/tmp/incident_incident.sql';


UPDATE incident_incident as ii
 SET petition_source = t.petition_source
  from (
   select
     incident_incident."id",
     tmp.petition_source
   from incident_incident
     left join tmp on incident_incident.id = tmp.id where tmp.petition_source notnull
) as t
where ii.id = t.id;

```
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
		OPTIONS (host '$FOREIGN_HOST', port '5432', dbname '$DB_NAME');

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
  EXECUTE 'COPY (SELECT id, source_sla FROM incident_incident ) TO ''' || $1 ||'''';
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
