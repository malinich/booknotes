#### <blockquote> windows 10 on usbFlash </blockquote>
```bash
sudo add-apt-repository ppa:nilarimogard/webupd8
sudo apt-get update
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
