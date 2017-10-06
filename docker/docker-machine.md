## create Remote VM using docker-machine Generic SSH Driver  [link][1]  
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

<sub> manual </sub>   
```bash
docker-machine create \
    --driver=generic \
    --generic-ip-address=IP_ADDRESS \
    --generic-ssh-user=USERNAME \
    --generic-ssh-key=PATH_TO_SSH_KEY \
    --generic-ssh-port=PORT \
     MACHINE_NAME
```
> You need to be able to SSH in with the key you provide for it to connect. Also, you'll need to make sure port 2376 is open (ufw allow 2376 in Debian/Ubuntu) and that you can use passwordless sudo (add %sudo ALL=(ALL) NOPASSWD:ALL to /etc/sudoers). 


[1]: http://www.thegeekstuff.com/2016/02/docker-machine-create-generic/
