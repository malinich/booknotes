commands  
```bash
 # выкачать из общего репозитория инстанс
docker pull google/nodejs
# запустить инстанс
docker run -dit google/nodejs node
# подсоединиться к инстансу
docker attach edb
# чтобы не разрывать связь после Ctrl-C
docker attach -sig-proxy=false 304f5db405ec 
# запустить инстанс с именем
docker run -it -name ub ubuntu /bin/bash  
# скопировать файл из инстанса к себе
docker cp ub:/$(echo -e '\007') /tmp/  
# запустить задачу
docker run -dit -name pp -p 8000:8000 ubuntu /usr/bin/python3.4 -m http.server 8000  
# удалить все докеры
docker rm $(docker ps -a -q)  
# delete all unused images
docker rmi $(docker images -aq -f 'dangling=true')

docker search python |less 
docker run --restart=on-failure:5 code.it
docker run --device=/dev/video0:/dev/video0
docker run -v $(pwd):$(pwd) -w $(pwd) -p 0.0.0.0:8000:8000 -it 
docker run  -it --rm ubuntu /bin/bash
docker run -dit -v /media/maka/7E24BAFF24BABA0B/music:/media ubuntu /bin/bash 
docker diff 068
docker commit -m "first commit code.it add" <container_name>  code.it:v1
sudo docker export red_panda > latest.tar

docker build . -t <init>

docker save -o codeit.tar code.it  # for images
docker load -i codeit.tar

sudo Docker export red_panda > latest.tar  # for container

docker run -it -p 5672:5672 -p 15672:15672 --sig-proxy=false tutum/rabbitmq 
# get  container ip
docker inspect --format '{{ .NetworkSettings.IPAddress }}' e05bb # id of container
```
nginx
```bash
docker run --name some-nginx -v /home/maka/workspaces/rts_notify/nginx.conf:/etc/nginx/nginx.conf:ro --net="host" -p 80:80 -d nginx 
```
hosts  
```
docker run --name some-nginx -v `pwd`/nginx.conf:/etc/nginx/nginx.conf:ro --expose=7000-7500  
		--add-host "srv1.rts.com":127.0.0.1 -d nginx 
nl /var/lib/docker/containers/0e81f3ab4ea851e780c20e132d3da1e021d03e48206c95fd4996f892befe36e/hosts 
```

rabbitMQ  
```
docker run -d --hostname my-rabbit --name some-rabbit -p 4369:4369 -p 127.0.0.1:5672:5672 -p 8080:15672 -e RABBITMQ_ERLANG_COOKIE='secret cookie here' rabbitmq:3-management
docker run -it --rm --link some-rabbit:my-rabbit -e RABBITMQ_ERLANG_COOKIE='secret cookie here' rabbitmq:3 bash
docker run -d --hostname my-rabbit --name some-rabbit -p 4369:4369 -p 127.0.0.1:5672:5672 -p 8080:15672 -e RABBITMQ_ERLANG_COOKIE='secret cookie here' rabbitmq:3-management
$ docker run -it --rm --link some-rabbit:my-rabbit -e RABBITMQ_ERLANG_COOKIE='secret cookie here' -e RABBITMQ_NODENAME=rabbit@my-rabbit rabbitmq:3 bash
# or need check
docker run -d -p 5672:5672 -p 15672:15672 -v /home/maka/dock_user/test/log/:/data/log -v /home/maka/dock_user/test/mnesia/:/data/mnesia dockerfile/rabbitmq rabbitmqctl start_app
docker run -d --hostname my-rabbit --name some-rabbit -p 4369:4369 -p 127.0.0.1:5672:5672 -p 8080:15672 -e RABBITMQ_ERLANG_COOKIE='secret cookie here' rabbitmq:3-management
docker run -it --rm --link some-rabbit:my-rabbit -e RABBITMQ_ERLANG_COOKIE='secret cookie here' rabbitmq:3 bash

# inside
rabbitmqctl -n rabbit@my-rabbit list_users
rabbitmqctl -n rabbit@my-rabbit list_permissions -p ips-developers
# with web client
docker run -d --hostname my-rabbit --name some-rabbit rabbitmq:3-management
# You can access it by visiting http://container-ip:15672 in a browser or, if you need access outside the host, on port 8080:
	
docker run -d --hostname my-rabbit --name some-rabbit -p 8080:15672 rabbitmq:3-management
# You can then go to http://localhost:8080 or http://host-ip:8080 in a browser.


# v3
docker run -d --hostname my-rabbit --name some-rabbit -p 4369:4369 -p 127.0.0.1:5672:5672 -p 8080:15672 -e RABBITMQ_ERLANG_COOKIE='secret cookie here' rabbitmq:3-management

docker run -it --rm --link some-rabbit:my-rabbit -e RABBITMQ_ERLANG_COOKIE='secret cookie here' rabbitmq:3 bash
rabbitmqctl -n rabbit@my-rabbit list_users
```
redis  
```
docker run -dt -p 6379:6379 --name redis-report -d redis
docker run -it --link redis-report:redis --rm redis sh -c 'exec redis-cli -h "$REDIS_PORT_6379_TCP_ADDR" -p "$REDIS_PORT_6379_TCP_PORT"'
# or
docker run --name some-redis -d redis
docker run -it --link some-redis:redis --rm redis sh -c 'exec redis-cli -h "$REDIS_PORT_6379_TCP_ADDR" -p "$REDIS_PORT_6379_TCP_PORT"'


```

postgresql
```
docker run -dit --name docker_postgres -e POSTGRES_HOST_AUTH_METHOD=trust -e POSTGRES_PASSWORD=password -e POSTGRES_USER=intranet -p 55435:5432 postgres:12.2
```
