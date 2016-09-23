## all users for all databases
```sql
DECLARE @DB_USers TABLE
(DBName SYSNAME, UserName SYSNAME, LoginType SYSNAME, AssociatedRole VARCHAR(MAX), create_date DATETIME, modify_date DATETIME, sid BINARY(32))
INSERT @DB_USers
EXEC sp_MSforeachdb
    '
    use [?]
    SELECT ''?'' AS DB_Name,
    case prin.name when ''dbo''
     then prin.name + '' (''+
     (select SUSER_SNAME(owner_sid)
     from master.sys.databases
     where name =''?'') + '')''
     else prin.name end AS UserName,
    prin.type_desc AS LoginType,
    isnull(USER_NAME(mem.role_principal_id),'''') AS AssociatedRole,
    create_date,
    modify_date,
    sid
    FROM sys.database_principals prin
    LEFT OUTER JOIN sys.database_role_members mem
     ON prin.principal_id=mem.member_principal_id
    WHERE prin.sid IS NOT NULL and prin.sid NOT IN (0x00) and
    prin.is_fixed_role <> 1 AND prin.name NOT LIKE ''##%'''

SELECT
  dbname,
  username,
  logintype,
  create_date,
  modify_date,
  sid,
  STUFF(
      (SELECT ',' + CONVERT(VARCHAR(500), associatedrole)
       FROM @DB_USers user2
       WHERE
         user1.DBName = user2.DBName AND user1.UserName = user2.UserName
       FOR XML PATH ('')
      ), 1, 1, '') AS Permissions_user

FROM @DB_USers user1

GROUP BY
  dbname, username, logintype, create_date, modify_date, sid
ORDER BY DBName, username

```
## object id
```sql
SELECT
  [sys].[objects].name,
  [sys].[objects].object_id,
  [sys].[objects].principal_id,
  [sys].[objects].schema_id,
  [sys].[objects].parent_object_id,
  [sys].[objects].type,
  [sys].[objects].type_desc,
  [sys].[objects].is_ms_shipped,
  [sys].[objects].is_published,
  [sys].[objects].is_schema_published,
  [sys].[objects].create_date,
  [sys].[objects].modify_date,
  [sys].[schemas].name AS SchemaName
FROM [sys].[objects]
  LEFT OUTER JOIN [sys].[schemas] ON ([sys].[objects].schema_id = [sys].[schemas].schema_id)
ORDER BY type_desc
```

## db id 
```sql
SELECT * FROM master.dbo.sysdatabases
```

## alter schema
```sql
ALTER SCHEMA guest TRANSFER [dbo].[Sequence-20160726-132132];  
```

## create login
```sql
CREATE LOGIN "AQM" WITH PASSWORD = 'maka';  
GO 
```
## open port for use 
```
netsh advfirewall firewall add rule name="MSSQL TCP Port 1433" dir=in action=allow protocol=TCP localport=1433
netsh advfirewall firewall add rule name="MSSQL TCP Port 1433" dir=out action=allow protocol=TCP localport=1433
```
## notify

list of all type notyfications  
```sql
select * from sys.event_notification_event_types;
```
see notifycations
```sql
select * from sys.service_queues
GO
select * from sys.services
GO
SELECT * FROM sys.events
GO
SELECT * FROM sys.event_notifications
GO
SELECT * FROM sys.server_event_notifications 
GO
```
event type of notify for grand permissions is 
```
10029	DDL_DATABASE_SECURITY_EVENTS	10016
10005	DDL_SERVER_SECURITY_EVENTS	10002
```
create notifications
```sql
use mytest

CREATE QUEUE dbo.EventNotificationQueue 
GO 

CREATE SERVICE [//mytest/EventNotificationService] 
ON QUEUE dbo.EventNotificationQueue 
([http://schemas.microsoft.com/SQL/Notifications/PostEventNotification]) 
GO

create event notification NotifyPermissionEventsAT
on server for ALTER_TABLE  to service '//mytest/EventNotificationService', 'current database'
GO

create event notification NotifyPermissionEventsDDL_SERVER_SECURITY_EVENTS
on server for DDL_SERVER_SECURITY_EVENTS  to service '//mytest/EventNotificationService', 'current database'
GO

create event notification NotifyPermissionEventsDDL_DATABASE_SECURITY_EVENTS
on server for DDL_DATABASE_SECURITY_EVENTS  to service '//mytest/EventNotificationService', 'current database'
GO

SELECT * FROM sys.server_event_notifications 
GO
```
## running queries
```sql
SELECT sqltext.TEXT,
req.session_id,
req.status,
req.command,
req.cpu_time,
req.total_elapsed_time
FROM sys.dm_exec_requests req
CROSS APPLY sys.dm_exec_sql_text(sql_handle) AS sqltext

-- While running above query if you find any query which is running for long time
-- it can be killed using following command.

KILL [session_id]
```
## running connections
```
exec sp_who2 
```
## triggers
```
set trigger to deny any modifications
```sql
CREATE TRIGGER safety  ON DATABASE   
FOR DROP_TABLE, ALTER_TABLE   
AS   
   PRINT 'You must disable Trigger "safety" to drop or alter tables!'   
   ROLLBACK;  
```

## permissions

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

create certificate
```sql
use mytest;

CREATE CERTIFICATE Shipping04   
   ENCRYPTION BY PASSWORD = 'pGFD4bb925DGvbd2439587y'  
   WITH SUBJECT = 'Sammamish Shipping Records',   
   EXPIRY_DATE = '20161001';  
GO

GRANT TAKE OWNERSHIP
    ON CERTIFICATE :: Shipping04   
    TO t1_igor;

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

## Patterns for implementing field change tracking [link](http://stackoverflow.com/questions/2682782/patterns-for-implementing-field-change-tracking)
The AuditLog table
```sql
CREATE TABLE [AuditLog] (
    [AuditLogID] [int] IDENTITY (1, 1) NOT NULL ,
    [ChangeDate] [datetime] NOT NULL CONSTRAINT [DF_AuditLog_ChangeDate] DEFAULT (getdate()),
    [RowGUID] [uniqueidentifier] NOT NULL ,
    [ChangeType] [varchar] (50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL ,
    [TableName] [varchar] (128) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL ,
    [FieldName] [varchar] (128) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL ,
    [OldValue] [varchar] (8000) COLLATE SQL_Latin1_General_CP1_CI_AS NULL ,
    [NewValue] [varchar] (8000) COLLATE SQL_Latin1_General_CP1_CI_AS NULL ,
    [Username] [varchar] (128) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL ,
    [Hostname] [varchar] (50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL ,
    [AppName] [varchar] (128) COLLATE SQL_Latin1_General_CP1_CI_AS NULL ,
    [UserGUID] [uniqueidentifier] NULL ,
    [TagGUID] [uniqueidentifier] NULL ,
    [Tag] [varchar] (8000) COLLATE SQL_Latin1_General_CP1_CI_AS NULL 
)
```
Trigger to log inserts
```sql
CREATE TRIGGER LogInsert_Nodes ON dbo.Nodes
FOR INSERT
AS

/* Load the saved context info UserGUID */
DECLARE @SavedUserGUID uniqueidentifier

SELECT @SavedUserGUID = CAST(context_info as uniqueidentifier)
FROM master.dbo.sysprocesses
WHERE spid = @@SPID

DECLARE @NullGUID uniqueidentifier
SELECT @NullGUID = '{00000000-0000-0000-0000-000000000000}'

IF @SavedUserGUID = @NullGUID
BEGIN
    SET @SavedUserGUID = NULL
END

    /*We dont' log individual field changes Old/New because the row is new.
    So we only have one record - INSERTED*/

    INSERT INTO AuditLog(
            ChangeDate, RowGUID, ChangeType, 
            Username, HostName, AppName,
            UserGUID, 
            TableName, FieldName, 
            TagGUID, Tag, 
            OldValue, NewValue)

    SELECT
        getdate(), --ChangeDate
        i.NodeGUID, --RowGUID
        'INSERTED', --ChangeType
        USER_NAME(), HOST_NAME(), APP_NAME(), 
        @SavedUserGUID, --UserGUID
        'Nodes', --TableName
        '', --FieldName
        i.ParentNodeGUID, --TagGUID
        i.Caption, --Tag
        null, --OldValue
        null --NewValue
    FROM Inserted i
```

Trigger to log Updates
```sql
CREATE TRIGGER LogUpdate_Nodes ON dbo.Nodes
FOR UPDATE AS

/* Load the saved context info UserGUID */
DECLARE @SavedUserGUID uniqueidentifier

SELECT @SavedUserGUID = CAST(context_info as uniqueidentifier)
FROM master.dbo.sysprocesses
WHERE spid = @@SPID

DECLARE @NullGUID uniqueidentifier
SELECT @NullGUID = '{00000000-0000-0000-0000-000000000000}'

IF @SavedUserGUID = @NullGUID
BEGIN
    SET @SavedUserGUID = NULL
END

    /* ParentNodeGUID uniqueidentifier */
    IF UPDATE (ParentNodeGUID)
    BEGIN
        INSERT INTO AuditLog(
            ChangeDate, RowGUID, ChangeType, 
            Username, HostName, AppName,
            UserGUID, 
            TableName, FieldName, 
            TagGUID, Tag, 
            OldValue, NewValue)
        SELECT 
            getdate(), --ChangeDate
            i.NodeGUID, --RowGUID
            'UPDATED', --ChangeType
            USER_NAME(), HOST_NAME(), APP_NAME(), 
            @SavedUserGUID, --UserGUID
            'Nodes', --TableName
            'ParentNodeGUID', --FieldName
            i.ParentNodeGUID, --TagGUID
            i.Caption, --Tag
            d.ParentNodeGUID, --OldValue
            i.ParentNodeGUID --NewValue
        FROM Inserted i
            INNER JOIN Deleted d
            ON i.NodeGUID = d.NodeGUID
        WHERE (d.ParentNodeGUID IS NULL AND i.ParentNodeGUID IS NOT NULL)
        OR (d.ParentNodeGUID IS NOT NULL AND i.ParentNodeGUID IS NULL)
        OR (d.ParentNodeGUID <> i.ParentNodeGUID)
    END

    /* Caption varchar(255) */
    IF UPDATE (Caption)
    BEGIN
        INSERT INTO AuditLog(
            ChangeDate, RowGUID, ChangeType, 
            Username, HostName, AppName,
            UserGUID, 
            TableName, FieldName, 
            TagGUID, Tag, 
            OldValue, NewValue)
        SELECT 
            getdate(), --ChangeDate
            i.NodeGUID, --RowGUID
            'UPDATED', --ChangeType
            USER_NAME(), HOST_NAME(), APP_NAME(), 
            @SavedUserGUID, --UserGUID
            'Nodes', --TableName
            'Caption', --FieldName
            i.ParentNodeGUID, --TagGUID
            i.Caption, --Tag
            d.Caption, --OldValue
            i.Caption --NewValue
        FROM Inserted i
            INNER JOIN Deleted d
            ON i.NodeGUID = d.NodeGUID
        WHERE (d.Caption IS NULL AND i.Caption IS NOT NULL)
        OR (d.Caption IS NOT NULL AND i.Caption IS NULL)
        OR (d.Caption <> i.Caption)
    END

...

/* ImageGUID uniqueidentifier */
IF UPDATE (ImageGUID)
BEGIN
    INSERT INTO AuditLog(
        ChangeDate, RowGUID, ChangeType, 
        Username, HostName, AppName,
        UserGUID, 
        TableName, FieldName, 
        TagGUID, Tag, 
        OldValue, NewValue)
    SELECT 
        getdate(), --ChangeDate
        i.NodeGUID, --RowGUID
        'UPDATED', --ChangeType
        USER_NAME(), HOST_NAME(), APP_NAME(), 
        @SavedUserGUID, --UserGUID
        'Nodes', --TableName
        'ImageGUID', --FieldName
        i.ParentNodeGUID, --TagGUID
        i.Caption, --Tag
        (SELECT Caption FROM Nodes WHERE NodeGUID = d.ImageGUID), --OldValue
        (SELECT Caption FROM Nodes WHERE NodeGUID = i.ImageGUID) --New Value
    FROM Inserted i
        INNER JOIN Deleted d
        ON i.NodeGUID = d.NodeGUID
    WHERE (d.ImageGUID IS NULL AND i.ImageGUID IS NOT NULL)
    OR (d.ImageGUID IS NOT NULL AND i.ImageGUID IS NULL)
    OR (d.ImageGUID <> i.ImageGUID)
END
```

Trigger to log Delete
```sql
CREATE TRIGGER LogDelete_Nodes ON dbo.Nodes
FOR DELETE
AS

/* Load the saved context info UserGUID */
DECLARE @SavedUserGUID uniqueidentifier

SELECT @SavedUserGUID = CAST(context_info as uniqueidentifier)
FROM master.dbo.sysprocesses
WHERE spid = @@SPID

DECLARE @NullGUID uniqueidentifier
SELECT @NullGUID = '{00000000-0000-0000-0000-000000000000}'

IF @SavedUserGUID = @NullGUID
BEGIN
    SET @SavedUserGUID = NULL
END

    /*We dont' log individual field changes Old/New because the row is new.
    So we only have one record - DELETED*/

    INSERT INTO AuditLog(
            ChangeDate, RowGUID, ChangeType, 
            Username, HostName, AppName,
            UserGUID, 
            TableName, FieldName, 
            TagGUID, Tag, 
            OldValue,NewValue)

    SELECT
        getdate(), --ChangeDate
        d.NodeGUID, --RowGUID
        'DELETED', --ChangeType
        USER_NAME(), HOST_NAME(), APP_NAME(), 
        @SavedUserGUID, --UserGUID
        'Nodes', --TableName
        '', --FieldName
        d.ParentNodeGUID, --TagGUID
        d.Caption, --Tag
        null, --OldValue
        null --NewValue
    FROM Deleted d
```
And in order to know which user in the software did the update, every connection "logs itself onto SQL Server" by calling a stored procedure:
```sql
CREATE PROCEDURE dbo.SaveContextUserGUID @UserGUID uniqueidentifier AS

/* Saves the given UserGUID as the session's "Context Information" */
IF @UserGUID IS NULL
BEGIN
    PRINT 'Emptying CONTEXT_INFO because of null @UserGUID'
    DECLARE @BinVar varbinary(128)
    SET @BinVar = CAST( REPLICATE( 0x00, 128 ) AS varbinary(128) )
    SET CONTEXT_INFO @BinVar
    RETURN 0
END

DECLARE @UserGUIDBinary binary(16) --a guid is 16 bytes
SELECT @UserGUIDBinary = CAST(@UserGUID as binary(16))
SET CONTEXT_INFO @UserGUIDBinary


/* To load the guid back 
DECLARE @SavedUserGUID uniqueidentifier

SELECT @SavedUserGUID = CAST(context_info as uniqueidentifier)
FROM master.dbo.sysprocesses
WHERE spid = @@SPID

select @SavedUserGUID AS UserGUID
*/
```
