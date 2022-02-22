update jsonb field in django 
```python
instance.__class__.objects.filter(id=instance.id).update(extra_info=Func(
    F("extra_info"),
    Value(["root_folder_id"]),
    Value(folder_res["id"], JSONField()),
    function="jsonb_set",
))
instance.refresh_from_db()
```
```
sudo apt-get install postgresql libpq-dev postgresql-client postgresql-client-common
```
```python
def namedtuple_factory(cursor, row):
    """
    Usage:
    con.row_factory = namedtuple_factory
    """
    fields = [col[0] for col in cursor.description]
    Row = namedtuple("Row", fields)
    return Row(*row)



```
