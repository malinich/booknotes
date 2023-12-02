#### this commads use when server start first time
```bash
useradd -m -G sudo administrator
useradd -m user-my

ssh-keygen  # on local-host
ssh-keygen -t ecdsa -b 521  # 521 bit
ssh-copy-id user@host  	# copy ssh key
# it add key to file ~/.ssh/authorized_keys (600)
ssh -i ~/.ssh/private_key user@host

vim /etc/sshd_config
-config ssh_config
PasswordAuthentication no
-sshd_config
PermitRootLogin no
AllowUsers user-my
PubkeyAuthentication yes
Protocol 2
Port 22
PasswordAuthentication no
KbdInteractiveAuthentication no

apt update
apt upgrade
apt install mc
apt install docker.io


mkdir /opt/_work
chown maka:maka /opt/_work

sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot certonly
# configure certbot
# configure github-runner
	- coздать раннер
https://github.com/malinich/colorInvasion/settings/actions/runners/new
- создать токен https://github.com/settings/tokens
gh auth login

DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
mkdir -p $DOCKER_CONFIG/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.23.3/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose

wget  https://github.com/cli/cli/releases/download/v2.39.2/gh_2.39.2_linux_amd64.deb

# iptables see iptables.txt
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT ! -i lo -d 127.0.0.0/8 -j REJECT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

iptables -A INPUT -p tcp --dport 2022 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -p icmp -m icmp --icmp-type 8 -j ACCEPT

iptables -A INPUT -j REJECT

iptables-save > /etc/iptables/iptables.rules
vim /etc/network/if-pre-up.d/iptables
	>>> /sbin/iptables-restore < /etc/iptables/iptables.rules
```
