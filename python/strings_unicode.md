```python
 f = open("56ad62-json.log", encoding="utf-8")
 qq=f.readline() 

 print(qq)                          
 {"log":\"message\": \"\\u0410\\u0432\\u0442\\u043e\\u0440\\u0438\\u0437\\u0430\\u0446\\u0438\\u044f \\u043f\\u043e\\u043b\\u044c\\u0437\\u043e\\u0432\\u0430\\u0442\\u0435\\u043b\\u044f\"}

(qq.encode().decode("unicode-escape").encode().decode("unicode-escape")) 
# '{"log":"message": "Авторизация пользователя"}\n'

```
