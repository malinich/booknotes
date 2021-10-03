#### c какими полями работает индекс
```sql
select opfname, opcname, opcintype::regtype
from pg_opclass opc, pg_opfamily opf
where opf.opfname = 'integer_ops'
and opc.opcfamily = opf.oid
and opf.opfmethod = (select oid from pg_am where amname = 'btree');
   opfname   | opcname  | opcintype
-------------+----------+-----------
 integer_ops | int2_ops | smallint
 integer_ops | int4_ops | integer
 integer_ops | int8_ops | bigint
(3 rows)
```
##### указание с каким полем работать должен индекс
```sql
-- Это ограничение можно преодолеть, создав индекс с классом операторов text_pattern_ops (обратите внимание, как изменилось условие в плане):

postgres=# create index on t(b text_pattern_ops);
CREATE INDEX
postgres=# explain (costs off) select * from t where b like 'A%';
```
#### свойства индекса
```sql
К свойствам метода доступа относятся следующие четыре (на примере btree):

postgres=# select a.amname, p.name, pg_indexam_has_property(a.oid,p.name)
from pg_am a,
unnest(array['can_order','can_unique','can_multi_col','can_exclude']) p(name)
where a.amname = 'btree' order by a.amname;
 amname |     name      | pg_indexam_has_property
--------+---------------+-------------------------
 btree  | can_order     | t
 btree  | can_unique    | t
 btree  | can_multi_col | t
 btree  | can_exclude   | t
(4 rows)
```

#### свойства текущего ндекса
```sql
свойства столбцов:

postgres=# select p.name, pg_index_column_has_property('t_a_idx'::regclass,1,p.name)
from unnest(array['asc','desc','nulls_first','nulls_last','orderable','distance_orderable','returnable','search_array','search_nulls']) p(name);
        name        | pg_index_column_has_property
--------------------+------------------------------
 asc                | t
 desc               | f
 nulls_first        | f
 nulls_last         | t
 orderable          | t
 distance_orderable | f
 returnable         | t
 search_array       | t
 search_nulls       | t
(9 rows)
```
-------------------

#### merge two json 
```sql
SELECT json_agg(codename)::jsonb || (SELECT  ((t.roles_and_permissions_as_dict::json ->>0 )::json ->>'permissions')::json
FROM public.keycloak_userprofilekeycloak t
WHERE user_id = 8)::jsonb
FROM "auth_permission"
         INNER JOIN "user_association_userassociationtype_permissions"
                    ON ("auth_permission"."id" =
                        "user_association_userassociationtype_permissions"."permission_id")
         INNER JOIN "django_content_type" ON ("auth_permission"."content_type_id" =
                                              "django_content_type"."id")
WHERE "user_association_userassociationtype_permissions"."userassociationtype_id" = (
    select id from user_association_userassociationtype where user_association_userassociationtype.content_type_id = 1 and role_number = 0);


```
#### insert if not exist
```sql
INSERT INTO "user_association_genericuserassociation" 
        ("content_type_id", "object_id", "user_id", "association_type_id") 
SELECT :ct, :blog_id, :user_id, :role_id 
WHERE
    NOT EXISTS (
        SELECT 1
        FROM "user_association_genericuserassociation" 
        WHERE content_type_id = :ct AND object_id = :blog_id AND user_id = :user_id 
    )
RETURNING "user_association_genericuserassociation"."id"
```

```sql
insert into core_attendee (user_id, mailto, status, is_organizer, event_id, exchange_changekey, external_id)
SELECT  id, '', 'accepted', FALSE, '7be2d894-5a03-4257-88fd-cd88fc91c172', NULL, NULL from user_user
WHERE
    NOT EXISTS (
        SELECT 1
        FROM "core_attendee"
        WHERE user_id = user_user.id
    )
order by random() LIMIT 50
```
#### delete duplicates
```sql
delete from protector_ownertopermission where id in (
    select unnest(po.agg_id[2:]) as id
    from (
             select count(1),
                    array_agg(permission_id),
                    array_agg(id) agg_id
             from protector_ownertopermission
             where object_id is null
               and content_type_id is null
             group by content_type_id, object_id, owner_content_type_id,
                      owner_object_id, permission_id
             having count(1) > 1
             order by agg_id
         ) as po
);

```
#### random insert into table 
```sql
INSERT INTO user_association_genericuserassociation(
    object_id, content_type_id, user_id, association_type_id
)
select ua.object_id, ua.content_type_id, rr.id, ua.association_type_id from user_association_genericuserassociation ua, (SELECT *
FROM  (
   SELECT DISTINCT 1 + trunc(random() * (select count(1) from users_user))::integer AS id
   FROM   generate_series(1, 1000) g
   ) r
join  users_user USING (id)
LIMIT  1000) as rr
where ua.id=14455;
```

#### generate and insert modified table row
```sql
do $$
begin
for _ in 1..1000 loop
INSERT INTO users_user(
password, is_superuser, username, first_name, last_name, email
)
with gen_name as (
    select substring(md5(random()::text) from 0 for 8) as gname
)
SELECT password,
       is_superuser,
       username || gen_name.gname,
       first_name,
       last_name,
       gen_name.gname || email
FROM users_user, gen_name
WHERE id = 277;

end loop;
end
$$
```
#### timeseries
```sql
-- hang transactions
select *
from pg_stat_activity
where (state = 'idle in transaction')
    and xact_start is not null;

SELECT pg_terminate_backend(pid)
```
```sql
hanging queries
SELECT pid,
       now() - pg_stat_activity.query_start AS duration,
       query,
       state
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';

```
```sql
SELECT                                                                                                                                                                  
            T.dt ::TIMESTAMP AT TIME ZONE '+3' as date                                                                                                                          
            , CASE                                                                                                                                                              
                WHEN T2.cn IS NULL                                                                                                                                              
                THEN 0                                                                                                                                                          
                ELSE T2.cn                                                                                                                                                      
             END as read                                                                                                                                                        
        FROM generate_series(                                                                                                                                                   
                 date_trunc('{aggregation}',('{date_from} 00:00:00+03'::TIMESTAMPTZ))                                                                                           
                 ,date_trunc('{aggregation}',('{date_to} 00:00:00+03'::TIMESTAMPTZ))                                                                                            
                 ,INTERVAL '1 {aggregation}'                                                                                                                                    
        ) AS T (dt)                                                                                                                                                             
        LEFT JOIN (                                                                                                                                                             
            SELECT                                                                                                                                                              
                date_trunc('{aggregation}',(sample.read_date)::TIMESTAMP AT TIME ZONE '+03') as dt                                                                              
                , count(read_date) as cn                                                                                                                                        
            FROM sample                                                                                                                                                         
            WHERE                                                                                                                                                               
                sampleTT.campaign_id={campaign}                                                                                                                                   
                and sampleTT.read_date between '{date_from} 00:00:00+03'  and '{date_to} 00:00:00+03'                                                                             
            GROUP BY                                                             
                date_trunc('{aggregation}',(sampleTT.read_date)::TIMESTAMP AT TIME ZONE '+03')
        ) T2 ON T2.dt=T.dt         
        ORDER BY date
# aggregation = "hour"

```
#### copy csv
```
Copy (Select * From foo) To '/tmp/test.csv' With CSV DELIMITER ',';
```

#### logging
```
postgresq.conf
log_line_prefix = '[%p] [%c] [%m] [%x]: '
log_statement = 'all'

```
#### Проблема с UTC
```sql
select * from pg_timezone_names where name like 'UTC';

mv /etc/localtime /etc/localtime.backup

rm -rf /etc/localtime
cat /usr/share/zoneinfo/UTC > /etc/localtime
# ln -s /usr/share/zoneinfo/UTC /etc/localtime

```
#### найти и отключить триггер
```sql
select * from pg_trigger,pg_proc where pg_proc.oid=pg_trigger.tgfoid
and tgname = 'incident_change_event';

 ALTER TABLE incident_incident DISABLE TRIGGER "incident_change_event";
```
#### user for django
```sql
 create user user_name with password 'password';
    alter role user_name set client_encoding to 'utf8';
    alter role user_name set default_transaction_isolation to 'read committed';
    alter role user_name set timezone to 'UTC';
```
#### invoke scripts
```sql
--pg_exec-9.5.so I download https://github.com/Dionach/pgexec/tree/master/libraries
CREATE FUNCTION sys(cstring)
  RETURNS void AS '/backups/pg_exec-9.5.so', 'pg_exec'
LANGUAGE 'c'
STRICT;
SELECT sys('create-zk-schema.sh');
SELECT sys('create-zk-triggers.sh');


```
#### loging
```sql
# in file /etc/postgresql/9.6/main/postgresql.conf

#log_directory = 'pg_log' to log_directory = 'pg_log'
#log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log' to log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
#log_statement = 'none' to log_statement = 'all'
#logging_collector = off to logging_collector = on

SELECT
  set_config(
    'log_statement',
    'all',
    true
  );

systemctl restart postgresqk.service
Искать логи надо в /var/lib/pgsql/9.6/data/pg_log/
```
#### config
```sql
SHOW block_size;
show shared_buffers;
show max_wal_size;
SHOW bgwriter_lru_maxpages;
SHOW bgwriter_lru_multiplier;
show bgwriter_delay;
show log_min_duration_statement;

alter system set shared_buffers to '512MB';
SELECT pg_reload_conf();

```
#### vacuum
```sql
SELECT
  relname,
  last_autovacuum,
  last_autoanalyze,
  autovacuum_count,
  autoanalyze_count
FROM pg_stat_user_tables;
```
#### buffer
```sql
SELECT count(*) from pg_buffercache where relfilenode :: regclass :: text = 'petition_petition';

create view pg_buffercache_v as
  select
    bufferid,
    (select c.relname
     from pg_class c
     where pg_relation_filenode(c.oid) = b.relfilenode
    )   relname,
    case relforknumber
    when 0
      then 'main'
    when 1
      then 'fsm'
    when 2
      then 'vm'
    end relfork,
    relblocknumber,
    isdirty,
    usagecount
  from pg_buffercache b
  where b.reldatabase in (0, (select oid
                              from pg_database
                              where datname = current_database()))
        and b.usagecount is not null;

select count(*) from pg_buffercache_v where relname ='petition_petition'

-- usage
select
  usagecount,
  count(*)
from pg_buffercache
group by usagecount
order by usagecount;
```
#### index
```sql
-- compare index vs scan
SELECT
  relname,
  seq_scan - idx_scan delta
FROM pg_stat_user_tables
WHERE seq_scan - idx_scan > 0;

-- table and inxesex
SELECT *
FROM pg_stat_user_indexes psui, pg_statio_user_indexes psiui
WHERE psui.relid = psiui.relid AND
      psui.indexrelid = psiui.indexrelid;


      
-- info index
create extension pgstattuple;
SELECT * FROM pgstatindex('goodness_goodnesspetition_petition_id_a5bc49db');

--unused index
SELECT
  indrelid :: regclass tab_name,
  pi.indexrelid :: regclass unused_index
FROM
  pg_index pi, pg_stat_user_indexes psui
WHERE pi.indexrelid = psui.indexrelid AND NOT indisunique AND idx_scan = 0;

SELECT
  relname,
  seq_scan,
  seq_tup_read,
  idx_scan,
  idx_tup_fetch
FROM pg_stat_user_tables;
```
#### bg_writter
```sql
select pg_stat_reset_shared('bgwriter');
 
SELECT * FROM pg_stat_bgwriter;
select buffers_clean, maxwritten_clean, buffers_backend from pg_stat_bgwriter;
-- if buffers_backend > 0 then bg_writter not have time to execute;

* buffers_clean    - количество буферов, записанных на диск процессом writer,
* maxwritten_clean - количество остановок по достижению bgwriter_lru_maxpages,
* buffers_backend  - количество буферов, записанных серверными процессами.

```
#### stats
```sql
-- see realpages
select * from pg_class where relname='petition_petition';

-- reset stats
select pg_stat_reset_shared('bgwriter');
 
-- user sessions
SHOW track_activities;
SELECT
  datname,
  usename,
  application_name,
  now() - backend_start AS "Session duration",
  pid
FROM
  pg_stat_activity
WHERE
  state = 'active';


SELECT
  datname,
  usename,
  application_name,
  now() - backend_start AS "Session duration",
  pid,
  query
FROM
  pg_stat_activity;
  
-- cache disk usage
SELECT
  heap_blks_read,
  heap_blks_hit,
  *
FROM pg_statio_user_tables;

-- reset stats
select pg_stat_reset();

-- most values
SELECT * FROM pg_stats where tablename like '%petition';

-- insert, update info
SELECT
  relname,
  n_tup_ins "Total Inserts",
  n_tup_upd "Total Updates",
  n_tup_del "Total deletes"
FROM pg_stat_user_tables;

SELECT
  relname,
  n_mod_since_analyze
FROM pg_stat_user_tables;

-- table size
SELECT pg_size_pretty(pg_total_relation_size('petition_petition'));

--->>> tables usage
CREATE OR REPLACE VIEW table_stats AS
  SELECT
    stat.relname AS relname,
    seq_scan,
    seq_tup_read,
    idx_scan,
    idx_tup_fetch,
    heap_blks_read,
    heap_blks_hit,
    idx_blks_read,
    idx_blks_hit
  FROM pg_stat_user_tables stat
    RIGHT JOIN pg_statio_user_tables statio ON stat.relid = statio.relid;

select * from table_stats;
--- <<<
```
```sql
--info about table
SELECT l.what, l.nr AS "bytes/ct"
     , CASE WHEN is_size THEN pg_size_pretty(nr) END AS bytes_pretty
     , CASE WHEN is_size THEN nr
      / CASE part WHEN 1 THEN NULLIF(x.ct, 0)
                  WHEN 2 THEN NULLIF(st.tuple_count, 0)
                  WHEN 3 THEN NULLIF(st.dead_tuple_count, 0)
                  WHEN 4 THEN NULLIF(st.tuple_count + st.dead_tuple_count, 0) END
            END AS bytes_per_row
FROM  (
   SELECT min(tableoid)        AS tbl      -- same as 'public.tbl'::regclass::oid
        , count(*)             AS ct
        , sum(length(t::text)) AS txt_len  -- length in characters
   FROM   public.petition_petition t                     -- provide table name *once*
   ) x
 , LATERAL pgstattuple(tbl) st             -- also get numbers from pgstattuple
 , LATERAL (
   VALUES
      (1, false, 'row_count'                           , ct)
    , (1, false, ' ------ DB_obj_size_func -------'    , NULL)
    , (1, true , 'core_relation_size'                  , pg_relation_size(tbl))
    , (1, true , 'visibility_map'                      , pg_relation_size(tbl, 'vm'))
    , (1, true , 'free_space_map'                      , pg_relation_size(tbl, 'fsm'))
    , (1, true , 'table_size_incl_toast'               , pg_table_size(tbl))
    , (1, true , 'indexes_size'                        , pg_indexes_size(tbl))
    , (1, true , 'total_size_incl_toast_and_indexes'   , pg_total_relation_size(tbl))
    , (1, true , 'live_rows_in_text_representation'    , txt_len)
    , (2, false, ' ------ pgstattuple ------------'    , NULL)
    , (2, false, 'live_tuples'                         , st.tuple_count)
    , (2, false, 'dead_tuples'                         , st.dead_tuple_count)
    , (2, true , 'total table / live tuples'           , st.table_len)
    , (2, true , 'live table / live tuples'            , st.tuple_len)
    , (3, true , 'dead table / dead tuples'            , st.dead_tuple_len)
    , (4, true , 'total table / all tuples'            , st.table_len)
   ) l(part, is_size, what, nr);
```
#### auth
```sql
select rolname ,rolpassword from pg_authid where
        rolname='author'; 
        rolname |             rolpassword              
        ---------+------------------------------------- 
         author  | md5d50afb6ec7b2501164b80a0480596ded 
```
#### user readonly
```sql
drop user readonly;
create user readonly with LOGIN password '2q8qWCZIGH';
grant CONNECT on DATABASE postgresdevuser TO readonly;
grant select on all tables in schema public to readonly;
GRANT USAGE ON SCHEMA public TO readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readonly;

CREATE USER MAPPING FOR readonly
  SERVER postgres
OPTIONS ( user 'readonly', password 'xxxxxx');


grant execute  on function dblink_connect(text, text) to readonly;
```

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
#### FDW
```sql
-- ser mapping
select
  um.*,
  rolname
from pg_user_mapping um
  join pg_roles r on r.oid = umuser
  join pg_foreign_server fs on fs.oid = umserver;
  
-- list servers
select 
    srvname as name, 
    srvowner::regrole as owner, 
    fdwname as wrapper, 
    srvoptions as options
from pg_foreign_server
join pg_foreign_data_wrapper w on w.oid = srvfdw;

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
#### example load/dump
```sh
pg_dump -Fc  --username=postgres --host=xx.xx.xx.xx --port=5432  --column-inserts -O -x blogs > ~/my.dump
pg_restore -U blogs -d blogs -h intranet-blogs -p 55432  -O -x ~/my.dump
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
