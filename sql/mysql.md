```sql
# change collation
ALTER DATABASE diffapp CHARACTER SET utf8 COLLATE utf8_unicode_ci;
ALTER TABLE onesclient_onesserverconfig CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci;
```

```bash
sudo mkdir /var/run/mysqld
sudo mkfifo /var/run/mysqld/mysqld.sock
sudo chown -R mysql /var/run/mysqld
```
```sql
GRANT ALL PRIVILEGES ON `имя_базы`.* TO myuser@'%' IDENTIFIED BY 'пароль';
```
```bash
# открыть доступ со всех хостов
# backup mysql
# сняло надо найти где хранятся базы данных: 
/etc/mysql/my.conf (/var/lib/mysql)
Msqldump –uadmin –pmypass --all-databases >all_databases.sql
# Бекап структуры базы
mysqldump --no-data --databases my_db1 my_db2 my_db3 > structurebackup.sql
			создание только структуры без данных

mysqldump -uAdmin -pSuperPass mydb | gzip -c > backup.sql.gz

# восстановление
mysql -u USERNAME -p DATABASE < mysqldump.sql
bzcat dbname.sql.bz2 | mysql -u root -p dbname
# Перенос БД между серверами
# Можно выполнить прямой перенос базы данных между серверами командой:
mysqldump --opt -u root -p dbname | mysql --host=remote-host -u user -p -C dbname
# удалить
mysqladmin -u USERNAME -p drop DATABASE
# Создать заново базу данных:
mysqladmin -u USERNAME -p create DATABASE
mysql -u USERNAME -p DATABASE < mysqldump.sql
```
