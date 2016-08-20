## create Remote VM using docker-machine Generic SSH Driver
```bash
adduser dockeradmin  
passwd dockeradmin  
# create ssh-key  
ssh-keygen  
ssh-copy-id dockeradmin@remote-server
# visudo
dockeradmin     ALL=(ALL) NOPASSWD: ALL
```
<sub>docker-machine create -d generic --generic-ip-address {ip-address} {docker-vm-name}</sub> 
```bash
$ docker-machine create -d generic --generic-ip-address 192.168.100.2 --generic-ssh-key $HOME/.ssh/id_rsa --generic-ssh-user dockeradmin --generic-ssh-port 22 dev-db
$ docker-machine ls
```


