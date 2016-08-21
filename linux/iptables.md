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
