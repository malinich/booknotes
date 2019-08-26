```python

class AwareDateTime(TypeDecorator):
    '''Results returned as aware datetimes, not naive ones.
    '''

    impl = DateTime

    def process_result_value(self, value, dialect):
        return value.replace(tzinfo=UTC)
        
created_on = db.Column(AwareDateTime, default=db.func.now(), nullable=False)
```
