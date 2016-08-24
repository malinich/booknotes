list of all type notyfications  
```sql
select * from sys.event_notification_event_types;
```

set trigger to deny any modifications
```sql
CREATE TRIGGER safety  ON DATABASE   
FOR DROP_TABLE, ALTER_TABLE   
AS   
   PRINT 'You must disable Trigger "safety" to drop or alter tables!'   
   ROLLBACK;  
```

see all builtin permissions
```sql
SELECT * FROM fn_builtin_permissions(default)
order by class_desc, permission_name;
```

create asymmetric key
```sql
use mydb;
CREATE ASYMMETRIC KEY PacificSales09   
    WITH ALGORITHM = RSA_2048   
    ENCRYPTION BY PASSWORD = '<enterStrongPasswordHere>';   
GO  
GRANT CONTROL
    ON ASYMMETRIC KEY :: PacificSales09   
       TO myuser;
```

see the exposed permissions 
```sql
use mydb;
select dp.NAME AS principal_name
     ,dp.type_desc AS principal_type_desc
     ,o.NAME AS object_name
     ,o.type_desc as Object_type
     ,p.permission_name
     ,p.state_desc AS permission_state_desc
	 ,[ObjectType] = CASE p.[class] 
									WHEN 1 THEN p.[class_desc]              
									ELSE p.[class_desc]     
									END   
	 ,[ObjectName] = CASE p.[class] 
									WHEN 0 THEN DB_NAME()
									WHEN 1 THEN OBJECT_NAME(p.major_id)  -- General objects
									WHEN 3 THEN schem.[name]                -- Schemas
									WHEN 4 THEN imp.[name]                  -- Impersonations
							   END
from sys.database_permissions p
left OUTER JOIN sys.all_objects o
     on p.major_id = o.OBJECT_ID
inner JOIN sys.database_principals dp
     on p.grantee_principal_id = dp.principal_id
LEFT JOIN
				sys.schemas schem ON schem.[schema_id] = p.[major_id]
LEFT JOIN
				sys.database_principals imp ON imp.[principal_id] = p.[major_id]
order by principal_name
```

grouped right for user
```sql
SELECT
  ID,
  UserName,
  Grantor,
  STUFF(
      (SELECT ',' +
              ObjectType +
              ':' +
              COALESCE(ObjectName, '') +
              ':' +
              PermissionType
              +
              ':GRANTOR:' + Grantor +
              ':State:' + PermissionState

       FROM (SELECT
               CASE WHEN [sys].[server_principals].name IS NULL
                 THEN CAST(CAST([sys].[database_principals].name AS VARBINARY(MAX)) AS NVARCHAR(MAX))
               ELSE CAST(CAST([sys].[server_principals].name AS VARBINARY(MAX)) AS NVARCHAR(MAX)) END AS UserName,
               CASE WHEN [sys].[database_permissions].class = 0
                 THEN DB_NAME()
               WHEN [sys].[database_permissions].class = 1
                 THEN OBJECT_NAME([sys].[database_permissions].major_id)
               WHEN [sys].[database_permissions].class = 3
                 THEN [sys].[schemas].name
               WHEN [sys].[database_permissions].class = 4
                 THEN [sys].[database_principals].name
               ELSE NULL END                                                                          AS ObjectName,
               T10.name                                                                               AS Grantor,
               [sys].[database_permissions].state_desc                                                AS PermissionState,
               [sys].[database_permissions].type                                                      AS PermissionType,
               [sys].[server_principals].principal_id                                                 AS ID,
               CASE WHEN [sys].[database_permissions].class = 1
                 THEN [sys].[objects].type_desc
               ELSE [sys].[database_permissions].class_desc END                                       AS ObjectType
             FROM [sys].[database_principals]
               LEFT OUTER JOIN [sys].[server_principals]
                 ON ([sys].[database_principals].sid = [sys].[server_principals].sid)
               LEFT OUTER JOIN [sys].[database_permissions]
                 ON ([sys].[database_principals].principal_id = [sys].[database_permissions].grantee_principal_id)
               LEFT OUTER JOIN [sys].[columns] ON ([sys].[database_permissions].major_id = [sys].[columns].object_id AND
                                                   (([sys].[columns].[column_id] =
                                                     [sys].[database_permissions].[minor_id])))
               LEFT OUTER JOIN [sys].[objects] ON ([sys].[database_permissions].major_id = [sys].[objects].object_id)
               LEFT OUTER JOIN [sys].[schemas] ON ([sys].[database_permissions].major_id = [sys].[schemas].schema_id)
               LEFT OUTER JOIN [sys].[database_principals] T10
                 ON ([sys].[database_permissions].grantor_principal_id = T10.principal_id)
             WHERE ([sys].[database_principals].type IN ('S', 'U', 'G', 'R', 'A') AND
                    NOT ([sys].[database_principals].name IN ('sys', 'INFORMATION_SCHEMA')) )) AS Perms
       WHERE (Perms.UserName = Princ.UserName)
       FOR XML PATH (''), TYPE).value('(./text())[1]', 'VARCHAR(MAX)'),
      1, 1, '') AS Permissions
FROM (SELECT
        [sys].[database_principals].name,
        [sys].[database_principals].principal_id,
        [sys].[database_principals].type,
        [sys].[database_principals].type_desc,
        [sys].[database_principals].default_schema_name,
        [sys].[database_principals].owning_principal_id,
        [sys].[database_principals].sid,
        [sys].[database_principals].is_fixed_role,
        [sys].[database_principals].authentication_type,
        [sys].[database_principals].authentication_type_desc,
        [sys].[database_principals].default_language_name,
        [sys].[database_principals].default_language_lcid,
        [sys].[database_principals].create_date,
        [sys].[database_principals].modify_date,
        [sys].[database_permissions].class                                                     AS Perm_class,
        [sys].[server_principals].name                                                         AS server_name,
        CASE WHEN [sys].[server_principals].name IS NULL
          THEN CAST(CAST([sys].[database_principals].name AS VARBINARY(MAX)) AS NVARCHAR(MAX))
        ELSE CAST(CAST([sys].[server_principals].name AS VARBINARY(MAX)) AS NVARCHAR(MAX)) END AS UserName,
        CASE WHEN [sys].[database_permissions].class = 0
          THEN DB_NAME()
        WHEN [sys].[database_permissions].class = 1
          THEN OBJECT_NAME([sys].[database_permissions].major_id)
        WHEN [sys].[database_permissions].class = 3
          THEN [sys].[schemas].name
        WHEN [sys].[database_permissions].class = 4
          THEN [sys].[database_principals].name
        ELSE NULL END                                                                          AS ObjectName,
        [sys].[server_principals].principal_id                                                 AS ID,
        T1.name                                                                                AS Grantor
      FROM [sys].[database_principals]
        LEFT OUTER JOIN [sys].[server_principals] ON ([sys].[database_principals].sid = [sys].[server_principals].sid)
        LEFT OUTER JOIN [sys].[database_permissions]
          ON ([sys].[database_principals].principal_id = [sys].[database_permissions].grantee_principal_id)
        LEFT OUTER JOIN [sys].[database_principals] T1
          ON ([sys].[database_permissions].grantor_principal_id = T1.principal_id)
        LEFT OUTER JOIN [sys].[schemas] ON ([sys].[database_permissions].major_id = [sys].[schemas].schema_id)
      WHERE ([sys].[database_principals].type IN ('S', 'U', 'G', 'R', 'A') AND
             NOT ([sys].[database_principals].name IN ('sys', 'INFORMATION_SCHEMA')))) AS Princ
GROUP BY ID, UserName, Grantor
        
```
