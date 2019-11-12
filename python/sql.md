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
