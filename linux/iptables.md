#### <blockquote>from linuxFormat 187
```bash
iptables -F
iptables -X

iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT ! -i lo -d 127.0.0.0/8 -j REJECT

iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

iptables -A INPUT -p tcp --dport 2022 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -p icmp -m icmp --icmp-type 8 -j ACCEPT

iptables -A INPUT -j REJECT
# save rules
iptables-save > /etc/iptables/iptables.rules
touch /etc/network/if-pre-up.d/iptables
# inside this file
#! /bin/sh
/sbin/iptables-restore < /etc/iptables/iptables.rules
 ```

#### <blockquote> vary commands
```bash
# show all forwarded ports
sudo iptables -t nat -vnL
# глянуть все правила
iptables -L -v
# просмотр сетевых карт и их мак-адресов
ip link list 
# маршрутизация всех таблиц в ядре
ip rule list 

# show all forwarded ports
sudo iptables -t nat -vnL

# правило очень удобно разрешает все уже установленные соединения и  все дальнейшие соединения, которые они создадут.
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Два правила работают с  трафиком в локальном интерфейсе. Множество программ обща­ются друг с  другом именно таким образом, но  мы  не  позволяем трафику получить доступ к lo извнешнего мира.
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT ! -i lo -d 127.0.0.0/8 -j REJECT

# устранить все правила
iptables --flush
iptables --table nat --flush
iptables --delete-chain
iptables --table nat --delete-chain


#  открыть порт для нескольких портов
iptables -A INPUT -p tcp --match multiport --dports 1024:3000 -j ACCEPT

# открываем траффик для ping
iptables -A INPUT -p icmp -m icmp --icmp-type 8 -j ACCEPT

# открыть порт
sudo iptables -A INPUT -p tcp --dport ssh -j ACCEPT
```
<sub>Опция -A указывает, что мы применяем это правило к входящему потоку, чтобы оно обрабатывался после всех осталь­ных правил. Мы  так­же можем использовать -I INPUT 1 для вставки этого правила в начало всей цепочки


#### <blockquote>redirect
```bash
echo 1 > /proc/sys/net/ipv4/ip_forward
iptables -F
iptables -t nat -F
iptables -X
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.12.77:80
iptables -t nat -A POSTROUTING -p tcp -d 192.168.12.77 --dport 80 -j SNAT --to-source 192.168.12.87
```
```
# redirect from 192.168.255.1:9092 ->  172.17.0.1:5281
iptables -t nat -A PREROUTING -p tcp --dport 9092 -j DNAT --to-destination 172.17.0.1:5281
iptables -t nat -A POSTROUTING -p tcp -d 172.17.0.1 --dport 5281 -j SNAT --to-source 192.168.255.1


 ```
#### <blockquote><sub>may be this is right</sub></blockquote>
```bash
# Маршрутизация и перенаправление, раздача инета
Добавить 1 в /proc/sys/net/ipv4/ip_forward
прописываем правила iptables
$ sudo iptables -A FORWARD -i eth0 -o wlan0 -s 193.169.1.1/24 -m conntrack --ctstate NEW -j ACCEPT
$ sudo iptables -A FORWARD -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
$ sudo iptables -A POSTROUTING -t nat -j MASQUERADE

# eth0 — сетевой интерфейс, откуда идет интернет (модем/маршрутизатор)
# wlan0 - опять же наш беспроводной интерфейс. 
# 193.169.1.1/24 — IP адрес нашего шлюза , где 24 — маска подсети
# Сейчас сохраним наши настройки iptables в файл, что бы потом прописать их в автозагрузку, т.к. после перезапуска компьютера, правила iptables сбрасываются
sh -c "iptables-save > /etc/iptables.wifi.rules"

gedit /etc/sysctl.conf
# Добавляем, в самый конец, следующие строчки, отвечающие за активацию роутинга :
net.ipv4.conf.default.forwarding=1
net.ipv4.conf.all.forwarding=1

gedit /etc/network/interfaces
pre-up iptables-restore < /etc/iptables.wifi.rules
```
#### <blockquote> Проброс порта внутрь сети через NAT в Linux (nat iptables linux)
```bash
# $EXT_R_IP - внешний IP роутера
# $LOCAL_IP - внутренний "фэйковый" адрес машины, которую надо "выкидывать" наружу
# $PORT1 - Порт, на который будут заходить извне и попадать на локальную машину
# $PORT2 - Порт, который "выбрасывается" наружу(например, 80 - http, либо 21 - ftp)
iptables -t nat -A PREROUTING -p tcp -d $EXT_R_IP --dport $PORT1 -j DNAT --to-destination $LOCAL_IP:$PORT2
iptables -A FORWARD -i eth0 -d $LOCAL_IP -p tcp --dport $PORT2 -j ACCEPT
```

