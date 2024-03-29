#### memmory check
```bash
ps -eo user,pid,ppid,cmd,pmem,rss --no-headers --sort=-rss | awk '{if ($2 ~ /^[0-9]+$/ && $6/1024 >= 1) {printf "PID: %s, PPID: %s, Memory consumed (RSS): %.2f MB, Command: ", $2, $3, $6/1024; for (i=4; i<=NF; i++) printf "%s ", $i; printf "\n"}}'
```

#### convert images
```bash
gs -dNOPAUSE -sDEVICE=jpeg -r200 -dJPEGQ=100 -sOutputFile=document-%02d.jpg "The_Artificial_Intelligence_Crush_2018.pdf" -dBATCH
```
#### bluetooth
```bash
sudo dmesg  | egrep -i 'blue|firm'
ls /lib/firmware/rtl_bt
```
#### unfo about devices 
```bash
lsmod
nm-tool
lshw -c network
lspci
tail -f /var/log/dmesg
hciconfig --all
lshw
```
#### vpn -wireguard
```bash
# https://www.the-digital-life.com/wireguard-docker/
sudo mkdir /opt/wireguard-server
sudo chown maka:maka /opt/wireguard-server
vim /opt/wireguard-server/docker-compose.yaml

version: "2.1"
services:
  wireguard:
    image: linuxserver/wireguard
    container_name: wireguard
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/London
      - SERVERURL=my-server-name  #optional
      - SERVERPORT=51820 #optional
      - PEERS=3 #optional
      - PEERDNS=auto #optional
      - INTERNAL_SUBNET=10.13.13.0 #optional
    volumes:
      - /opt/wireguard-server/config:/config
      - /lib/modules:/lib/modules
    ports:
      - 51820:51820/udp
    sysctls:
      - net.ipv4.conf.all.src_valid_mark=1
    restart: unless-stopped

cd /opt/wireguard-server
docker-compose up -d
docker exec -it wireguard /app/show-peer <peer-number>
# если надо увеличитьб кол-во, то меняем peers
docker-compose up -d --force-recreate
```


#### vpn openvpn
```bash
# https://p.umputun.com/2014/08/12/svoi-sobstviennyi-vpn-za-3-minuty/

CID=$(docker run -d --restart=always --privileged -p 1194:1194/udp -p 443:443/tcp umputun/dockvpn)
docker run -t -i -p 8080:8080 --volumes-from $CID umputun/dockvpn serveconfig
# либо docker run -t -i -p 8181:8080 --volumes-from $CID umputun/dockvpn serveconfig

```
#### разделить параметры по аргументам из файла
```bash
grep -v ^# .env | xargs -0  | awk 'NF' | sed 's/=/ /g' | cat | xargs -n 3 sh -c 'dotenv set $1 $2'
```
#### jpg to pdf
```
# change size image
mogrify -verbose -resize '40%' *.JPG
img2pdf *.jp* --output combined.pd
```
#### timer ####
```
echo 'pmi action hibernate' | at now + 30 min
echo pm-suspend | sudo at 11pm
```
#### zram
```bash
modprobe zram num_devices=4

SIZE=512
echo $(($SIZE*1024*1024)) > /sys/block/zram0/disksize
echo $(($SIZE*1024*1024)) > /sys/block/zram1/disksize
echo $(($SIZE*1024*1024)) > /sys/block/zram2/disksize
echo $(($SIZE*1024*1024)) > /sys/block/zram3/disksize

mkswap /dev/zram0
mkswap /dev/zram1
mkswap /dev/zram2
mkswap /dev/zram3

swapon /dev/zram0 -p 10
swapon /dev/zram1 -p 10
swapon /dev/zram2 -p 10
swapon /dev/zram3 -p 10

```
#### set latency for network
```
# You can slow the speed of localhost (network) by adding delay.
# Use ifconfig command to see network device: on localhost it may be lo and on LAN its eth0.

# to add delay use this command (adding 1000ms delay on lo network device)
tc qdisc add dev lo root netem delay 1000ms

# to change delay use this one
tc qdisc change dev lo root netem delay 1ms

# to see current delay
tc qdisc show dev lo

# and to remove delay

tc qdisc del dev lo root netem delay 1000ms

```
#### parse env file and set them
```
export $(grep -v '^#' ./envs/.env.base | xargs)
export $(grep -v '^#' ./envs/.env.closed | xargs)
```

#### update application
```bash
# Install
# via http://askubuntu.com/questions/510056/how-to-install-google-chrome

wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add - 
sudo sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt-get update 
sudo apt-get install google-chrome-stable
# Update
sudo apt-get --only-upgrade install google-chrome-stable

```
#### flash
```bash
sudo apt-get install ubuntu-restricted-extras
sudo apt install browser-plugin-freshplayer-pepperflash
```

#### convert image png to jpg
```bash
$ ls -1 *.png | xargs -n 1 bash -c 'convert "$0" "${0%.png}.jpg"'

```

#### turn off usb protect
```bash
sudo umount /dev/sdb1
sudo hdparm -r0 /dev/sdb
#Create a new mount point and mount it there (my userID from /etc/passwd is 1000)

sudo mkdir /media/andrew/temp
sudo mount -o uid=1000 /dev/sdb1 /media/andrew/temp

# it'll still complain that it's read-only.
sudo hdparm -r0 /dev/sdb1
sudo mount -o remount,rw /dev/sdb1
```
#### restore root pass
```bash
# reboot in recovery mode
# choose root
passwd jorge
mount -o remount,rw /
```
#### chinease linux
```bash
sudo locale-gen zh_TW.UTF-8
sudo apt-get install ibus-chewing
```
#### performance
```bash
sar -u 10 8 
 The first value used here, that is 10, displays the number of seconds between sar readings and the second value used here, that is 8, indicates the number of times you want sar to run.
```
#### tmux
```bash
printf '\033]2;%s\033\' "message", # установить имя панели
```
#### <blockquote> set proxy cli  </blockquote>
```
gsettings list-recursively org.gnome.system.proxy
org.gnome.system.proxy autoconfig-url ''
org.gnome.system.proxy ignore-hosts ['localhost', '127.0.0.0/8']
org.gnome.system.proxy mode 'none'
org.gnome.system.proxy use-same-proxy true
org.gnome.system.proxy.ftp host ''
org.gnome.system.proxy.ftp port 0
org.gnome.system.proxy.http authentication-password ''
org.gnome.system.proxy.http authentication-user ''
org.gnome.system.proxy.http enabled false
org.gnome.system.proxy.http host ''
org.gnome.system.proxy.http port 8080
org.gnome.system.proxy.http use-authentication false
org.gnome.system.proxy.https host ''
org.gnome.system.proxy.https port 0
org.gnome.system.proxy.socks host ''
org.gnome.system.proxy.socks port 0

# > link https://developer.gnome.org/ProxyConfiguration/
```

#### <blockquote> change date  </blockquote>
```
# disable date update
timedatectl set-ntp 0
# on
timedatectl set-ntp 1
# change
timedatectl set-time "2018-08-16 23:30"
```
#### <blockquote> remove exclude files  </blockquote>
```
find */*/migrations -type f -name '*.py' -not -name '__init__.py' -print0 |xargs -0 rm -
```

#### <blockquote> windows 10 on usbFlash </blockquote>
```bash
sudo add-apt-repository ppa:nilarimogard/webupd8
sudo apt-get update
sudo apt-get install woeusb
```

#### <blockquote> health </blockquote>
```bash
sudo add-apt-repository ppa:slgobinath/safeeyes
sudo apt update
sudo apt install safeeyes
```

#### <blockquote>mount</blockquote>
```bash
# mount from user
sudo mount -t vfat -o umask=0022,gid=1000,uid=1000 /dev/sdb4 /mnt/  
# use other options by this
mount -t "vfat" -o "uhelper=udisks2,nodev,nosuid,uid=1000,gid=1000,shortname=mixed,dmask=0077,utf8=1,showexec,flush" "/dev/sdb1" "/media/maka/4E29-3255"

mount -t "ntfs" -o "uhelper=udisks2,nodev,nosuid,uid=1000,gid=1000,dmask=0077,fmask=0177" "/dev/sda5" "/media/maka/7E24BAFF24BABA0B1"
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

#### <blockquote>curl
```bash
# instead curl use httpie
pip install httpie
http GET http://127.0.0.1:8552/api/users X-Requested-With:XMLHttpRequest Authorization:'xToken ola-la' --pretty=all --verbose
```

####  <blockquote>brutforce 
```bash
for i in `seq 1 1000`; do mysql -u root --password=bad -h 127.0.0.1 2>/dev/null;echo  $i; done
```

#### <blockquote>skype
```bash
# launch skype
LD_PRELOAD=/usr/lib/i386-linux-gnu/mesa/libGL.so.1 skype &
# You can put the last statement into a shell script, e.g. ~/bin/skype , or create a .desktop-File with this content:

Name=Skype
Terminal=false
Exec=LD_PRELOAD=/usr/lib/i386-linux-gnu/mesa/libGL.so.1 skype
TargetEnvironment=Unity
```

#### <blockquote> clean memory
```bash
sync
root@maka-NB:/home/malinich# echo 3 > /proc/sys/vm/drop_caches 
```

#### <blockquote> Locale
```bash
locale -a
sudo gedit /var/lib/locales/supported.d/local
ru_RU.CP1251 CP1251
ru_RU.KOI8-R KOI8-R
# sudo locale-gen ru_RU.UTF-8
# sudo locale-gen en_US.UTF-8
locale-gen
Generating locales...
  en_US.UTF-8... done
  ru_RU.CP1251... done
  ru_RU.KOI8-R... done
  ru_RU.UTF-8... up-to-date
  ru_UA.UTF-8... up-to-date
Generation complete.
locale -a
# set locale
export LANGUAGE=en_US.UTF-8
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export LC_CTYPE="en_US.UTF-8"
locale-gen en_US.UTF-8
sudo dpkg-reconfigure locales

# on sever (ssh?)
 AcceptEnv LANG LC_*

# troubles with local into rar and zip-archives for Ubuntu:
sudo add-apt-repository ppa:frol/zip-i18n
sudo apt-get update
sudo apt-get install p7zip-full p7zip p7zip-rar
```
#### <blockquote> monitors
```bash
## change ration
# 1. смотрим название мониторов
xrandr
# 2. copy
cvt 1360 768  "1360x768_60.00" 84.75  1360 1432 1568 1776  768 771 781 798 -hsync +vsync
# 3. insert this 
xrandr --newmode "1360x768_60.00" 84.75  1360 1432 1568 1776  768 771 781 798 -hsync +vsync
xrandr --addmode VGA1 "1360x768_60.00"
xrandr --output VGA1 --mode "1360x768_60.00"
```

<blockquote><sub>add two monitos</sub></blockquote>

```bash
# After  the output, let's suppose that you have a laptop which panel is LVDS and an external VGA  port which we will regard as VGA, we execute:
$ xrandr --output VGA1 --mode 1280x1024 --right-of LVDS1
$ xrandr --newmode $(gtf 1280 800 68 | grep Modeline | sed s/Modeline\ // | tr -d '"')
$ xrandr --addmode VGA 1280x800_68.00
# use
xrandr --output VGA1 --mode 1440x900 --right-of LVDS1
# off
$ xrandr --output VGA --off
# mirror
xrandr --output LVDS1  --output VGA1 --mode 1440x900 --same-as LVDS1
```

<blockquote><sub>brightness</sub></blockquote>

```bash
sudo su -c "echo 4500 > /sys/class/backlight/intel_backlight/brightness"
```

#### <blockquote> version of Ubuntu
```
lsb_release -a
```

#### <blockquote>show capacity of folders
```
find -size +10M -exec du -sh {} \;
du -h --threshold=1 || du -h --threshold=1G | sort -hnG
```

#### <blockquote>Xorg
```bash
# отключение загрузки иксов происходит строкой  в консоли:
sudo update-rc.d -f gdm remove (для гнома)
sudo update-rc.d -f kdm remove (для kde)

# после отключения, для запуска иксов в консоли набирать
startx

# восстановить автозагрузку иксов при старте системы:
sudo update-rc.d -f gdm defaults (для гнома)
sudo update-rc.d -f kdm defaults (для kde)

# Отключить запуск unity и вообще графической оболочки в ubuntu 12.04 можно подправив файл /etc/default/grub

# Нужно изменить строку
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
# на
GRUB_CMDLINE_LINUX_DEFAULT="text"
# выполнить
sudo update-grub

# смена оконного менеджера
sudo update-alternatives --config x-display-manager

# Настройка разрешения в xorg.conf (выставить разрешения кастомное)
# получить модлайн + install brightness
> xrandr --output $(xrandr|head -n2|tail -n1|cut -d\  -f 1) --scale 0.5x0.5 # for scale
> xrandr --output eDP1 --mode 1920x1080 # set cutom mode
> xrandr -s 1920x1080  # set custom mode
> cvt 1920 1080 60 # take modeline
# take brightness info
> sudo find /sys/ -type f -iname '*brightness*'
> ls /sys/devices/pci0000:00/0000:00:02.0/drm/card0/card0-LVDS-1/intel_backlight/brightness
> # intel

# save config

Section "Monitor"                                                                                                                                                                            
    Identifier      "External DVI"
    Modeline        "1920x1080_60.00"  173.00  1920 2048 2248 2576  1080 1083 1088 1120 -hsync +vsync
    Option          "PreferredMode" "1920x1080_60.00"
EndSection

Section "Device"
    Identifier  "Card0"
    Driver      "intel"
    Option      "Backlight"  "External DVI"
EndSection

Section "Screen"
    Identifier "Screen 0"
    Device     "Card0"
    Monitor    "External DVI"
    DefaultDepth  24
    SubSection "Display"
        Modes "1920x1080_60.00" "1920x1080"
    EndSubSection
EndSection
~

```


#### <blockquote>find</blockquote> 
```bash
# найти файлы больще 100 mb
find / -size +100000k
# последние 10 мин создания
find /mnt/PfrDataMail_virtual_3/ -mmin -10 -type d -printf "%p %TY-%Tm-%Td %TH:%TM:%TS %Tz\n"  
# найти по расширению
find $directory -type f -name "*.in"
# найти по range даты
touch --date "2007-01-01" /tmp/start
touch --date "2008-01-01" /tmp/end
find /data/images -type f -newer /tmp/start -not -newer /tmp/end
```

#### <blockquote> pppoe</blockquote> 
```bash
# настройка pppoe:
# Для автоматического создания PPPoE подключения при загрузке компьютера можно прописать следующие строки в /etc/network/interfaces:
auto ppp0 
iface ppp0 inet ppp
  pre-up /sbin/ifconfig eth0 up
  provider pppoe
# on/off
sudo poff pppoe 
sudo pon pppoe
```

#### <blockquote> sound</blockquote> 
```bash
amixer -D pulse sset Master 100% on
amixer -D pulse sset Master 100% off
amixer -c0 sset Capture cap # nocap
# show used sound card
fuser -v /dev/snd/*
## sset volume more than 100%
pactl set-sink-volume alsa_output.pci-0000_00_1b.0.analog-stereo 200%
```

#### <blockquote>use command in background</blockquote> 
```bash
nohup command-name &
```

#### <blockquote>create swap</blockquote> 
```bash
dd if=/dev/zero of=/swapfile bs=1M count=1024
mkswap /swapfile
swapon /swapfile
/swapfile swap swap defaults 0 0 to /etc/fstab
```

#### <blockquote> sudo </blockquote> 
```bash
# allow user to reboot computer
visudo user hostname =NOPASSWD: /usr/bin/systemctl poweroff,/usr/bin/systemctl halt,/usr/bin/systemctl reboot  
# /etc/sudoers 

sudo visudo -f /etc/sudoers.d/myOverrides 
User ALL = NOPASSWD:/sbin/mount -t ntfs /dev/sda2 /home/User/mnt/ntfs
sudo mount /dev/sda5 /media

```
<blockquote><sub>run gtk applications in sudo</sub></blockquote>

```bash
xhost +SI:localuser:root
```
####  ip

```bash
ip addr show 
cat tcp
irb
```

####  awk
```bash
awk 'NR==3 {printf "%.1f%%\\n",($3/70)*100}' /proc/net/wireless
# nr - это номер строки
# $3 - это третье слово 0-вся строка 

# filter by colums(100.000kb) and change column
du /home/user/  -d 1 |awk '{if ($1 > 100000) {print}}'| awk '$1=$1/1024"M"'
 
```

#### sed
```bash
rename 's/\.bak$//' *.bak # переименовать массово
find /home/maka/Dropbox/phone/ -type f -print0 -name "*.vnt" |xargs -0 sed -i.bak 's/=0D=0A/\n/'  # replace 1 раз
find /home/maka/Dropbox/phone/ -name "2014-06-18.19.34.38.vnt" -print0 |xargs -0 sed -i.bak 's/=0D=0A/\n/g' # много раз
```

#### Xinput
```bash
xinput list-props 12
xinput --help
xinput set-prop 12 273 1

udevadm info -a -p /devices/pci0000:00/0000:00:1d.0/usb4/4-1/4-1.2

sudo vim /etc/udev/rules.d/90-mouse.rules
# ATTRS{serial}=="AC993E820D0029", SYMLINK+="helloUsbMouse"
# ATTRS{idVendor}=="046d", ATTRS{idProduct}=="c048", SYMLINK+="helloUsbMouse"

service udev restart
udevadm monitor
# plug/unplug

xinput list
# find "Touchpad" and remembe id: forexample is 15
xinput set-prop 15 "Device Enabled" 0
```
#### battary
```bash
upower -i $(upower -e | grep 'BAT') | grep -E "state|to\ full|percentage"
```

#### libs
```
apt-file search libXss.so
```

#### notifi
```
echo fs.inotify.max_user_watches=100000 | sudo tee -a /etc/sysctl.conf; sudo sysctl -p

while ping -c 1 127.0.0.1 > /dev/null; do acpi -t -f | while read tem; do notify-send "$tem"; done; sleep 300; done
```

> use webfs (lightweight HTTP daemon, to serve static content to http://localhost:80) [link](https://github.com/ourway/webfsd)  
[docs](https://github.com/ourway/webfsd/blob/master/webfsd.man)  

```
webfsd -F -p 80 -u d3vid -g d3vid /home/d3vid/Documents/www/ -f index.html
```

> disable service  

```
sudo update-rc.d avahi-daemon disable
# or
systemctl disable service_name.service
```

#### sed
```bash
find ./ -maxdepth 1 -regextype sed -regex ".\/9787561923177.*" -print 
```

#### Change Login Screen Background in Ubuntu 17.10
```bash
xhost +local: && sudo gedit /etc/alternatives/gdm3.css
# change it
#lockDialogGroup {
  background: #2c001e url(resource:///org/gnome/shell/theme/noise-texture.png);
  background-repeat: repeat; }

# by it
#lockDialogGroup {
  background: #2c001e url(file:///usr/share/backgrounds/Aardvark_Wallpaper_Grey_4096x2304.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center; 
}
# Finally save the file and restart your computer to apply changes.
```

#### fonts
```
# create ~/.fonts, copy ttf
sudo fc-cache -fv
```
