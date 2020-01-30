##### change storage folder for docker
```
Let's get started by modifying systemd's docker start up script. Open file /lib/systemd/system/docker.service with your favorite text editor and replace the following line where /new/path/docker is a location of your new chosen docker directory:

FROM:
ExecStart=/usr/bin/docker daemon -H fd://
TO:
ExecStart=/usr/bin/docker daemon -g /new/path/docker -H fd://

When ready stop docker service:

# systemctl stop docker

```
##### get names
```
docker inspect --format='{{.Name}}' $(sudo docker ps -aq --no-trunc)
```
##### clear log
```
echo "" > $(docker inspect --format='{{.LogPath}}' 0a014706d6c7)  # container-id
```

>clean docker 
```
sudo docker system prune -a -f
sudo docker rm -v $(sudo docker ps -a -q -f status=exited)
sudo docker rmi -f  $(sudo docker images -f "dangling=true" -q)
docker volume ls -qf dangling=true | xargs -r docker volume rm

```

```
docker cp mlg4eicurzk_postgres_1:/backups/backup_2018_07_09T16_33_32.sql.gz .
```

run as service
```ini
touch /home/maka/www/greenback.service

systemctl enable /home/maka/www/greenback.service 
systemctl is-enabled greenback.service

[Unit]
Description=the greenback container compose
Requires=docker.service
After=docker.service

[Service]
Restart=always
ExecStart=/usr/local/bin/docker-compose -f /home/maria/www/docker-compose.yml up
ExecStop=/usr/local/bin/docker-compose -f /home/maria/www/docker-compose.yml stop

[Install]
WantedBy=default.target
```

> run python on container port

```bash
python manage.py runserver `hostname -I|tr -d '[:space:]'`:8001 

```
fix froblem with 'Error starting daemon: error initializing graphdriver: driver not supported'  
need delete --storage-driver aufs
```ini
# autorun docker
# /etc/systemd/system/docker.service 
# after systemctl daemon-reload
[Service]
ExecStart=/usr/bin/docker daemon -H tcp://0.0.0.0:2376 -H unix:///var/run/docker.sock --storage-driver aufs --tlsverify --tlscacert /etc/docker/ca.pem --tlscert /etc/docker/server.pem --tlskey /etc/docker/server-key.pem --label provider=generic
MountFlags=slave
LimitNOFILE=1048576
LimitNPROC=1048576
LimitCORE=infinity
Environment=

[Install]
WantedBy=multi-user.target
```

delete intermediate images 
```bash
docekr rmi $(docker images | grep none | awk '{print $3}')
```

use teminal from conteaner
```
environment:
    - TERM=xterm
# or
docker run -e TERM=xterm
```   
from practice 
```bash
# run managment - UI rabbitMQ
docker run 
    -d 
    --hostname my-rabbit 
    --name some-rabbit 
    -p 4369:4369 
    -p 127.0.0.1:5672:5672 
    -p 8080:15672 
    -e RABBITMQ_ERLANG_COOKIE='secret cookie here' rabbitmq:3-management

# nginx
docker run 
    --name taiga-nginx 
    -v /home/maka/workspaces/taiga/taiga-back/nginx.conf:/etc/nginx/nginx.conf:ro 
    --net="host" 
    -p 80:80 
    -v /home/maka/workspaces/taiga/taiga-back/static:/var/taiga 
    -v /home/maka/workspaces/taiga/taiga-front/dist/:/var/taiga-front 
    -i nginx

# redis
docker run 
    -dt 
    -p 6379:6379 
    --name redis-report 
    -d redis

# ---->

#<!---
# flags

# --privileged
# This gives additional privileges to this container.
docker run -it  --privileged --rm --name aha ubuntu /bin/bash
> mount /dev/sda5 /mnt

# -v 
# mount volume
docker run 
    -v $(pwd):$(pwd) 
    -p 0.0.0.0:8001:8000 
    -it  
    --rm 
    --name OD-pythonserver-4 
    python:2.7 python -m SimpleHTTPServer 8000;

# -w workdir
docker run 
    -v $(pwd):$(pwd) 
    -w $(pwd) 
    -p 0.0.0.0:8001:8000 
    -it  
    --name OD-pythonserver-4 python:2.7 
    python -m SimpleHTTPServer 8000;

# --device
# -device flag that you can use to mount a device without needing \
# to use the --privileged flag.
docker run --device=/dev/video0:/dev/video0

# --restart
# restart flag to specify a restart policy for containers
# -no: Do not restart the container if it dies (default).
# -on-failure: Restart the container if it exits with a non-zero exit code. It \
# can also accept an optional maximum restart count (for example, on-failure:5).
# -always: Always restart the container no matter what exit code is returned.
docker run --restart=always code.it

## Docker service
# search
# search command allows us to search for Docker images in the public registry.
docker search python | less

# pull
# pull command is used to pull images or repositories from a registry
docker pull <path_to_registry>/<image_or_repository>:<version>

# start
# start command starts a stopped container
# The options have the same meaning as with the docker run command.
docker start [-i] [-a] <container(s)>

# stop
# sending the SIGTERM and then the SIGKILL signal after a grace period
# SIGTERM signals the process to terminate. \
# The SIGKILL signal is used to forcibly kill a process.

# rm 
# delete dockers
docker rm $(docker ps -a -q)

# ps
# -a, --all
# -q, --quiet   only id
# -s, --size    This prints the sizes of the containers.
# -l, --latest  This shows only the latest container
# -n=""         This shows the last n containers 
# --before=""   This shows the containers created before the specified ID
# --after=""

# logs
# logs command shows the logs of the container

# inspect
# inspect command allows you to get the details
# inspect command provides a flag, -f (or the --follow flag), \
# which allows you to specify exactly what you want using 
# Go templates.
docker inspect -f  '{{.NetworkSettings.IPAddress}}' OD-pythonserver-4

# top
# top command shows the running processes

# attach
# attach command attaches to a running container.

# kill 
# kill command kills a container and sends the SIGTERM signal

# cp
# cp command copies a file or folder from 
# a container's filesystem to the host path.

# port
# port command looks up the public-facing port that is
# bound to an exposed port in the container:
docker port OD-ghost 2368

## build
# inside running docker container /bin/bash for example
# you can install git and npm install
# after in different tabs, run
# docker diff <container-name>
# docker commit [option] <container> [repository[:tag]]
# -p --pause    pause container
# -m --message  message for commit
# -a --author   author of commit

# images
# -a --all      show all images
# -f --filter
# --no-tranc    doesn't truncate output
# -q --quiet    show only images id

# rmi
# remove images
# -f --force
# --no-prune    doesn't delete untagged parents

# save
# save images or repo in a tarball
# -o specify file instead of streaming to the stdout
docker save -o codeit.tar code.it

# load
# load inage from tarball
docker load -i codeit.tar

# export 
# it flattens layers.. it merge all layers, all of the metadata
# of the image history is lost
sudo Docker export red_panga > latest.tar

# import
# import command creates an empty filesystem image and imports 
# the contents of the tarball to it
# docker import URL|- [REPOSITORY[:TAG]]
docker import http://example.com/test.tar.gz
cat sample.tgz | docker import – testimage:imported

# tag 
# tag  It helps identify a specific version of an image.
# docker tag IMAGE [REGISTRYHOST/][USERNAME/]NAME[:TAG]
# username/repository:tag convention.
docker tag shrikrishna/code.it:v1 shrikrishna/code.it:latest


# login
# Docker login [OPTIONS] [SERVER]
# After login, the details will be stored in the $HOME/.dockercfg path

# push
docker push NAME[:TAG]

# history
docker history shykes/nodejs

# events
# events command prints all the events that are handle
# by the docker daemon, in real time:
# --since=""
# --until=""

# wait
# wait command blocks until a container stops, then prints its exit code:
docker wait CONTAINER(s)

# build
# build command builds an image from the source files at a specified path:
# -t, --tag=""
# -q, --quiet
# --rm=true     This removes intermediate containers after a successful build.
# --force-rm    This always removes intermediate containers, even after unsuccessful builds.
# --no-cache    This command does not use the cache while building the image.

# .dockerignore
# all this folders will be ignored
bundles
.gopath
vendor/pkg

# Dockerfile
# FROM instruction sets the base image
# FROM <image>:<tag>

# MAINTAINER instruction allows you to set the author 
# MAINTAINER <name>

# RUN
# RUN instruction will execute any command in a new layer on top of the current
# image, and commit this image. The image thus committed will be used 
# for the next instruction in the Dockerfile.
# RUN <command> form
# RUN ["executable", "arg1", "arg2"...] form
# In the first form, the command is run in a shell, 
# specifically the /bin/sh -c <command> shell. The second form is useful 
# in instances where the base image doesn't have a /bin/sh shell

# CMD 
# CMD instruction provides the default command for a container to execute.
# CMD ["executable", "arg1", "arg2"...]

# The difference between the RUN and CMD instructions is that a RUN instruction 
# actually runs the command and commits it, whereas the CMD instruction is 
# not executed during build time. It is a default command to be run when the 
# user starts a container,

# ENTRYPOINT
# ENTRYPOINT instruction allows you to turn your Docker image into an 
# executable. In other words, when you specify an executable in an ENTRYPOINT, 
# containers will run as if it was just that executable.

# WORKDIR 
# WORKDIR instruction sets the working directory for the RUN, CMD, 
# and ENTRYPOINT Dockerfile commands that follow it:

# EXPOSE
# expose instruction informs Docker that a certain port is to be exposed 
# when a container is started:
# This instruction is useful when linking containers,

# ENV command is used to set environment variables:
# ENV <key> <value>

# USER
# USER instruction sets the username or UID to use when running the image
# and any following the RUN directives:

# VOLUME 
# instruction will create a mount point 

# ADD
# ADD instruction is used to copy files into the image
# ADD <src> <dest>

# COPY
# The Copy instruction is similar to the ADD instruction. The difference 
# is that the COPY instruction does not allow any file out of the context. 
# So, if you are streaming Dockerfile via the stdin file or a URL 
# (which doesn't point to a source code repository), the COPY instruction 
# cannot be used.
# COPY <src> <dest>

# ONBUILD instruction adds to the image a trigger that will be executed 
# when the image is used as a base image for another build:
# This is useful when the source application involves generators that need 
# to compile before they can be used.

# CPU
# docker run -c 10 -it ubuntu /bin/bash
# value, 10, is the relative priority given to this container with 
# respect to other containers
# cat /sys/fs/cgroup/cpu/docker/cpu.shares
# Is it possible to set CPU shares when a container is already running? 
# Yes. Edit the file at /sys/fs/cgroup/cpu/docker/<container-id>/cpu.shares 
# and enter the priority you want to give it.
# grep -w cgroup /proc/mounts | grep -w cpu

# memory
# docker run -m <value><optional unit>
# unit can be b, k, m, or g, representing 
# bytes, kilobytes, megabytes, and gigabytes
# change on the fly
# echo 1073741824 > \ /sys/fs/cgroup/memory/docker/<container_id>/memory.limit_in_bytes

# Devicemapper
# -dm.basesize: This specifies the size of the base device, which 
# is used by containers and images
# By default, this is set to 10 GB. 
docker -d -s devicemapper --storage-opt dm.basesize=50G

# -dm.loopdatasize: This is size of the thin pool. The default size is 100 GB
# It is to be noted that this file is sparse, so it will not initially take up 
# this space; instead, it will fill up gradually as more and more data 
# is written into it:
docker -d -s devicemapper --storage-opt dm.loopdatasize=1024G

# -dm.loopmetadatasize: As mentioned earlier, two block devices are created,
# one for data and another for metadata. 1% from size
docker -d -s devicemapper --storage-opt dm.loopmetadatasize=10G

# dm.fs: This is the filesystem type to use for the base device. 
# The ext4 and xfs filesystems are supported, although ext4 is taken by default:
docker -d -s devicemapper --storage-opt dm.fs=xfs

# -dm.datadev: This specifies a custom block device to use (instead of loopback)
# or the thin pool. If you are using this option, it is recommended to 
# specify block devices for both data and metadata to completely avoid 
# using the loopback device:
docker -d -s devicemapper --storage-opt dm.datadev=/dev/sdb1 \-storage-opt dm.metadatadev=/dev/sdc1

## network
# --ip: This option allows us to set the host's IP address at the 
# container-facing docker0 interface. As a result, this will be the default 
# IP address used when binding container ports. For example this option can 
# be shown as follows:
docker -d --ip xxx.xxx.xxx.xxx

# --ip-forward: This is a Boolean option. If it is set to false, the host 
# running the daemon will not forward the packets between containers or 
# from the outside world to the container, completely isolating it
# (from a network perspective).
# This setting can be checked using the sysctl command:
# sysctl net.ipv4.ip_forward
# net.ipv4.ip_forward = 1

# --icc: This is another Boolean option that stands for inter-container 
# communication. If it is set to false, the containers will be isolated from 
# each other, but will still be able to make general HTTP requests 
# to package managers and so on.

# custom IP address range
# subnet
docker -d --bip 192.168.0.1/24

# link
# docker run --link CONTAINER_IDENTIFIER:ALIAS 

```

