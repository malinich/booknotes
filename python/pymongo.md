```python
from autoapp import app
from mongoengine import connect
from app.user.models import User
from flask_jwt_extended import create_access_token
import os

ctx = app.test_request_context()
ctx.push()
connect(host=os.environ["DATABASE_URI"])
u=User.objects(pk="xxx").first()
create_access_token(u)

```
