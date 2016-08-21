```bash
sudo apt-get install dhcp3-server
# Редактировать конфиг 
sudo vim /etc/dhcp3/dhcpd.conf
    Subnet 192.168.0.0 netmask 255.255.255.0 {
    Option routers 192.168.0.1;
    Option sub-net-mask 255.255.255.0;
    Option domain-name-servers 192.168.0.1;
    Range 192.168.0.10 192.168.0.100;
    Host onec{
Hardware Ethernet 00:00:00:00:00:00;
Fixed-address 192.168.0.5;
}
}
```
