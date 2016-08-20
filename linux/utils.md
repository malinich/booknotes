#### <blockquote>mount</blockquote>
```bash
# mount from user
sudo mount -t vfat -o umask=0022,gid=1000,uid=1000 /dev/sdb4 /mnt/  
# use other options by this
mount -t "vfat" -o "uhelper=udisks2,nodev,nosuid,uid=1000,gid=1000,shortname=mixed,dmask=0077,utf8=1,showexec,flush" "/dev/sdb1" "/media/maka/4E29-3255"
```
#### <blockquote>kill proc</blockquote>
```bash
netstat -nlp4 |grep python | sed -E 's/.* LISTEN (.*)\/python.*/\1/'|xargs kill

ps -u `id -u -n` -o pid,uname,comm -C python |grep -E -o '[0-9]+ .* python'|grep -E -o '[0-9]+'|xargs kill
```

#### <blockquote>capture from cam</blockquote>
```bash
avconv -f video4linux2 -s 640x480 -i /dev/video0 -ss 0:0:2 -frames 1 /tmp/out.jpg 
```

#### curl
```bash
# instead curl use httpie
pip install httpie
http GET http://127.0.0.1:8552/api/users X-Requested-With:XMLHttpRequest Authorization:'xToken ola-la' --pretty=all --verbose
```

#### skype
```bash
# launch skype
LD_PRELOAD=/usr/lib/i386-linux-gnu/mesa/libGL.so.1 skype &
# You can put the last statement into a shell script, e.g. ~/bin/skype , or create a .desktop-File with this content:

Name=Skype
Terminal=false
Exec=LD_PRELOAD=/usr/lib/i386-linux-gnu/mesa/libGL.so.1 skype
TargetEnvironment=Unity
```


