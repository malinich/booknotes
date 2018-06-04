#### copy tables
```
// v1
CREATE TABLE <tablename>_copy (LIKE <tablename> INCLUDING ALL); // copy table with columns
INSERT INTO <tablename>_copy SELECT * FROM <tablename>;

// v2
select * into newtable from oldtable // without index
select indexdef from pg_indexes where tablename='oldtable';  //copy index


// function for copy

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
