> docker

```
sudo apt-get install \
     apt-transport-https \
     ca-certificates \
     curl \
     python-software-properties
curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
   $(lsb_release -cs) \
   stable"

sudo apt-get update
sudo apt-get install docker-ce

# custom
curl -O https://download.docker.com/linux/ubuntu/dists/zesty/pool/stable/amd64/docker-ce_17.09.0~ce-0~ubuntu_amd64.deb
sudo dpkg -i docker-ce_17.09.0~ce-0~ubuntu_amd64.deb
sudo usermod -a -G docker $USER

# limits
docker run ....
 --sysctl net.core.somaxconn=1024 \
 --ulimit sigpending=62793 \
 --ulimit nproc=131072 \
 --ulimit nofile=60000 \
 --ulimit core=0 \

        
```

> compose
```
sudo curl -L https://github.com/docker/compose/releases/download/1.17.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

> mashine

```
sudo apt-get install virtualbox
curl -L https://github.com/docker/machine/releases/download/v0.13.0/docker-machine-`uname -s`-`uname -m` >/tmp/docker-machine &&
chmod +x /tmp/docker-machine &&
sudo cp /tmp/docker-machine /usr/local/bin/docker-machine

scripts=( docker-machine-prompt.bash docker-machine-wrapper.bash docker-machine.bash ); for i in "${scripts[@]}"; do sudo wget https://raw.githubusercontent.com/docker/machine/v0.13.0/contrib/completion/bash/${i} -P /etc/bash_completion.d; done

docker-machine create --driver virtualbox default
```
