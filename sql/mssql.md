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
