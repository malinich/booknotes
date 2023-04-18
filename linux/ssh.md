#### fingerprint
```bash
ssh-keyscan revasan.club | ssh-keygen -lf -
```
```bash
file=$(mktemp)
ssh-keyscan host > $file 2> /dev/null
ssh-keygen -l -f $file
# check record in host
sudo ssh-keygen -f ~/.ssh/known_hosts -R 192.168.0.99

# fix file known_hosts
sudo chown -v $USER ~/.ssh/known_hosts
```
#### rsync
```
rsync -avH --progress -e ssh file root@192.168.xxx.xxx:/home/
```

```bash
# доступ
ssh -p 7337 root@xx.xxx.xxx.xxx
# aws
chmod 400 malinich-apple.pem
ssh -i "malinich-apple.pem" ec2-user@xx.xx.xxx.xxx

# scp
scp user@host:/directory/SourceFile TargetFile          |file 
scp -r user@host:/directory/SourceFolder TargetFolder   |folder

# для синхронизации по ssh надо:
# доки тут: http://www.cis.upenn.edu/~bcpierce/unison/download/releases/stable/unison-manual.html
sudo apt-get install unison unison-gtk

# sshfs
sudo apt-get install sshfs
sshfs username@server.ru:/home/user mount-point/

# Но это не самый удобный вариант использования — надо каждый раз 
# в консоли маунтить папку, конечно, можно все это прописать в 
# /ets/fstab, но у нас есть вариант получше —  Automount FUSE.
sudo apt-get install afuse
# После чего достаточно его запустить с нужными парамтерами:
afuse -o mount_template="sshfs %r:/ %m" -o unmount_template="fusermount -u -z %m" ~/sshfs/
# Например: ls ~/sshfs/tmpvar@foobarhost.com вначале малость потормозит,
# потом покажет содержимое корневой папки / сервера foobarhost.com. 
# Конечно, не всегда удобно писать полный адрес и параметры доступа 
# к серверу tmpvar@foobarhost.com:22, поэтому мы их перенесем 
# в настройки доступа ssh.
cat ~/.ssh/config    
... Host file-storage
... Hostname filestorage.server.ru
... Port 2222
... HostKeyAlias    fs 
... User            admin

sh-3.2# /etc/init.d/ssh restart
... Could not load host key: /etc/ssh/ssh_host_rsa_key
... Could not load host key: /etc/ssh/ssh_host_dsa_key
... Restarting OpenBSD Secure Shell server: 
        sshdCould not load host key: /etc/ssh/ssh_host_rs
... Could not load host key: /etc/ssh/ssh_host_dsa_key
# issue solved!
ssh-keygen -t rsa -f /etc/ssh/ssh_host_rsa_key
ssh-keygen -t dsa -f /etc/ssh/ssh_host_dsa_key

# <!------
# генерация публичного ключа из приватного
ssh-keygen -y -f key.pem > key.pub

# The permissions of ~/.ssh on the server should be 700. 
# The file ~/.ssh/authorized_keys (on the server) mode of 600. 
# The permissions of the (private) key on the client-side should be 600.

# sshd_conf
PasswordAuthentication no

# авторизация без пароля
ssh-keygen (далее на запрос не вводим пароля)
# по умолчанию id_rsa копируется в ~/.ssh/
# id_rsa.pub копируем на сервер в папку пользователя  которого будем входить
# на сервере:-

cat ~/id_rsa.pub >> ~/.ssh/authorized_keys
# /etc/ssh/sshd_config:
# Should we allow Identity (SSH version 1) authentication?
RSAAuthentication yes
# Should we allow Pubkey (SSH version 2) authentication?
PubkeyAuthentication yes
# для определенного пользователя войтий
AllowUsers user1 user2
# для группы 
AllowGroups root

# Where do we look for authorized public keys?
# relative to the user's home directory
AuthorizedKeysFile    .ssh/authorized_keys
                 
# Best way to use multiple SSH private keys on one client
# ~/.ssh/config:
                    
# Host myshortname realname.example.com
# Hostname realname.example.com
IdentityFile ~/.ssh/realname_rsa 
# Host myother realname2.example.org
# Hostname realname2.example.org
IdentityFile ~/.ssh/realname2_rsa

sudo systemctl restart sshd

... error:
# Agent admitted failure to sign using the key.Permission denied (publickey)
# solvation:
ssh-add ~/.ssh/id_rsa

# подключение всего траффика через другую машину
sudo apt-get install sshuttle
sudo sshuttle --dns -r maka@steek.me:22 0/0

# проброс портов
ssh <user>@<host> -L <local port>:<remote ip>:[remote port]
# <>: ssh name@host -L 3307:127.0.0.1:3306
# <>: ssh name@xxx.xxx.xxx.xxx -L 3307:127.0.0.1:3306
# <>: ssh -L 8112:127.0.0.1:8112 -L 5000:127.0.0.1:5000 <user>@2b.org.ru
# <>: ssh -L 5433:127.0.0.1:5432 malinich@91.224.xxx.xxx -p 60123 


# deny root
# Add the user. 
adduser admin
id admin
... uid=10018(admin) gid=10018(admin) groups=10018(admin)
ls -lad /home/admin/
... drwx------ 2 admin admin 4096 Jun 25 16:01 /home/admin/
# Set the password for the admin user. When prompted, type and then retype the password. 
passwd admin
... Changing password for user admin.
# For sudo permissions for your new admin user, use the following command. 
echo 'admin ALL=(ALL) ALL' >> /etc/sudoers
ssh admin@my.ip.or.hostname
... admin@my.ip.or.hostname\'s password:
# Verify that you can su (switch user) to root with the admin user.  
su -
whoami
... root
vi /etc/ssh/sshd_config
# Change this line:
#PermitRootLogin yes
to
PermitRootLogin no
/etc/init.d/sshd restart

# see ssh fingerprint
ls /etc/ssh/*key*
# select needed type, <>: rsa, or /etc/ssh/ssh_host_ecdsa_key
# to me work /etc/ssh/ssh_host_ecdsa_key
ssh-keygen -lf /etc/ssh/ssh_host_rsa_key.pub 
... xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx

# version 2, same
cat foo.pub
... ssh-rsa xxxxxx.....
echo 'xxxxxxxxx....'| base64 -d | md5sum
