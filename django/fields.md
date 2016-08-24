#### create own field
``` python
class BetterCharField(models.Field):
    def __init__(self, max_length, *args, **kwargs):
        self.max_length = max_length
        super(BetterCharField, self).__init__(*args, **kwargs)

    def db_type(self, connection):
        return 'char(%s)' % self.max_length

# In the model:
class MyModel(models.Model):
    # ...
    my_field = BetterCharField(25)

# from_db_value(), он будет вызываться при всех операциях загрузки данных с базы данных,
# включая агрегации и вызовы values().
# to_python() вызывается при десериализации и при вызове метода clean() в формах.
import re

from django.core.exceptions import ValidationError
from django.db import models

def parse_hand(hand_string):
    """Takes a string of cards and splits into a full hand."""
    p1 = re.compile('.{26}')
    p2 = re.compile('..')
    args = [p2.findall(x) for x in p1.findall(hand_string)]
    if len(args) != 4:
        raise ValidationError("Invalid input for a Hand instance")
    return Hand(*args)

class HandField(models.Field):
    # ...

    def from_db_value(self, value, expression, connection, context):
        if value is None:
            return value
        return parse_hand(value)

    def to_python(self, value):
        if isinstance(value, Hand):
            return value

        if value is None:
            return value

        return parse_hand(value)

# Преобразование объектов Python в значения в запросе

# get_prep_value()
# если вы переопределили to_python() ва следует переопределить и 
# get_prep_value() чтобы преобразовать объект Python обратно 
# в значение для запроса.
def get_prep_value(self, value):
    return ''.join([''.join(l) for l in (value.north,
        value.east, value.south, value.west)])

# get_db_prep_value
# Некоторые типы данных (например, даты) должны быть в определенном 
# формате при передаче в бэкенд базы данных. Эти преобразования должны
# быть выполнены в get_db_prep_value(). Объект подключения к базе 
# данных передается в аргументе connection. Это позволяет выполнить 
# преобразование, которое зависит от используемой базы данных.
def get_db_prep_value(self, value, connection, prepared=False):
    value = super(BinaryField, self).get_db_prep_value(value, connection, prepared)
    if value is not None:
        return connection.Database.Binary(value)
    return value
    
# get_db_prep_save
# Если ваше поле требует дополнительного преобразования данных при сохранении, 
# переопределите для этого метод get_db_prep_save().

# Обработка данных перед сохранением

#  pre_save(), если хотите изменить значение перед сохранением. Например, 
# поле DateTimeField использует этот метод для установки значения при auto_now или auto_now_add.

# Подготовка значений при поиске в базе данных

# Как и преобразование значения поля, преобразование значения для поиска(WHERE) в 
# базе данных выполняется в две фазы.
# get_prep_lookup() выполняет первую фазу подготовки параметров 
# фильтрации: преобразование типа и проверку данных.
# Подготавливает value для передачи в фильтр запроса (WHERE в SQL). lookup_type 
# содержит один из фильтров Django: exact, iexact, contains ... etc
class HandField(models.Field):
    # ...

    def get_prep_lookup(self, lookup_type, value):
        # We only handle 'exact' and 'in'. All others are errors.
        if lookup_type == 'exact':
            return self.get_prep_value(value)
        elif lookup_type == 'in':
            return [self.get_prep_value(v) for v in value]
        else:
            raise TypeError('Lookup type %r not supported.' % lookup_type)
# get_db_prep_lookup
# Если вам нужны дополнительные преобразования значения при использовании его в 
# запросе, вы можете переопределить метод get_db_prep_lookup().

```
