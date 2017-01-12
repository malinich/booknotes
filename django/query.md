> query filter

```python

q_obj= Q()
for ms in removed:
    q_obj |= Q(member_of_id=ms[0], subject_id=ms[1])
Membership.objects.filter(q_obj)
