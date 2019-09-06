#### create self-signed cert
```bash
# create
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./deploy.key -out ./deploy.crt

# convert to pem
sudo openssl x509 -in deploy.crt -out deploy.pem -outform PEM
 
```

#### insert ssl
```
для начала вам необходимо объединить 3 сертификата (сам SSL-сертификат, промежуточный и корневой сертификаты) в один файл. Для этого создайте на локальном ПК новый текстовый документ с именем your_domain.crt, например, при помощи блокнота.

Поочередно скопируйте и вставьте в созданный документ каждый сертификат. После вставки всех сертификатов файл должен иметь такой вид:

        
-----BEGIN CERTIFICATE-----
#Ваш сертификат#
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
#Промежуточный сертификат#
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
#Корневой сертификат#
-----END CERTIFICATE-----

    
обратите внимание: один сертификат идёт следом за другим, без пустых строк;

Данные сертификатов вы можете найти в электронном сообщении, отправленным на ваш контактный e-mail после выпуска сертификата.
2.создайте файл your_domain.key и скопируйте в него содержание приватного ключа сертификата;
3.загрузите файл your_domain.crt и приватный ключ сертификата your_domain.key на сервер, в директорию /etc/ssl/. Директория может быть и любой другой;
4.
откройте конфигурационный файл Nginx и отредактируйте виртуальный хост вашего сайта, добавив следующие строки:

        
server{
listen 443 ssl;                                       # добавлена строка
ssl_certificate /etc/ssl/your_domain.crt;      # добавлена строка
ssl_certificate_key /etc/ssl/your_domain.key;  # добавлена строка
server_name your.domain.com;

    
/etc/ssl/your_domain.crt и /etc/ssl/your_domain.key — пути до загруженных вами файлов.
```
