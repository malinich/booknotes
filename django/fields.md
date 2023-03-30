#### custom field that allow use get_{field_name} and allow to update field_name
```python
class GetSetSerializerField(Field):
    def __init__(self, child, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.child = child

    def to_internal_value(self, data):
        if isinstance(data, typing.List):
            return [self.child.to_internal_value(item) for item in data]
        return self.child.to_internal_value(data)

    def to_representation(self, value):
        func_attr = getattr(
            self.parent.instance,
            'get_'+self.field_name,
            lambda: value
        )
        data = func_attr()
        if isinstance(data, typing.List):
            return [self.child.to_representation(item) for item in data]
        return self.child.to_representation(data)

```
#### use jsonb for filter
```python
# извлечь данные, привести к типу время
When(
    service__key=service.key,
    custom_fields_values__ui_control__key=ui_control_key,
    then=Cast(
        Func(
            F("custom_fields_values__value"),
            Value("items"),
            Value("0"),
            Value("date_from"),
            function="jsonb_extract_path_text"
        ),
        DateTimeField()
    )
)

# вытащить данные и привести к типу
 When(
        service__key=service.key,
        custom_fields_values__ui_control__key=ui_control_key,
        then=Cast(
            KeyTextTransform("date_from", "custom_fields_values__value__items__0"),
            DateTimeField()
        )
    )
)

```
#### update jsonb field in django 
```python
instance.__class__.objects.filter(id=instance.id).update(extra_info=Func(
    F("extra_info"),
    Value(["root_folder_id"]),
    Value(folder_res["id"], JSONField()),
    function="jsonb_set",
))
instance.refresh_from_db()


#### m2m DRF save
```python
class Question(models.Model):
    content = models.TextField()
    answers = models.ManyToManyField(Answer, through='QuestionAnswer')

class Answer(models.Model):
    content = models.TextField()


class QuestionAnswer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    is_correct = models.BooleanField()

# serializer

class QuestionSerializer(serializers.ModelSerializer):
    answers = QuestionAnswerSerializer(many=True, source='questionanswer_set')

    class Meta:
        model = Question
        fields = "__all__"

    def create(self, validated_data):
        q_data = validated_data.pop('questionanswer_set')
        instance = Question.objects.create(**validated_data)
        for question in q_data:
            d = dict(question)
            QuestionAnswer.objects.create(question=instance, answer_id=d['answer_id'], is_correct=d['is_correct'])
        return instance

    def update(self, instance, validated_data):
        q_data = validated_data.pop('questionanswer_set')
        for item in validated_data:
            if Question._meta.get_field(item):
                setattr(instance, item, validated_data[item])
        QuestionAnswer.objects.filter(question=instance).delete()
        for question in q_data:
            d = dict(question)
            QuestionAnswer.objects.create(question=instance, answer_id=d['answer_id'], is_correct=d['is_correct'])
        instance.save()
        return instance
```

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
# pre_save(), если хотите изменить значение перед сохранением. Например, 
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

# форма
class HandField(models.Field):
    # ...

    def formfield(self, **kwargs):
        # This is a fairly standard way to set up some defaults
        # while letting the caller override them.
        defaults = {'form_class': MyFormField}
        defaults.update(kwargs)
        return super(HandField, self).formfield(**defaults)

# get_internal_type
# Если вы определили метод db_type(), нет необходимости использовать 
# get_internal_type() – он не будет использоваться.
# django.db.backends.<db_name>.base.DatabaseWrapper.data_types
class HandField(models.Field):
    # ...

    def get_internal_type(self):
        return 'CharField'

# Чтобы указать как значения сериализуются сериализатором, переопределите метод value_to_string()
class HandField(models.Field):
    # ...

    def value_to_string(self, obj):
        value = self._get_val_from_obj(obj)
        return self.get_prep_value(value)
```
