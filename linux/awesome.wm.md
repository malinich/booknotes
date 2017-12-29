> source [here](https://aur.archlinux.org/packages/awesome-git/)

> install
```bash
sudo add-apt-repository  ppa:klaus-vormweg/awesome -y
sudo apt update
sudo apt install  awesome -y

sudo apt-get install cmake
apt-get install lua5.2
apt-get install lua5.2-dev

git clone https://github.com/awesomeWM/awesome.git
cd awesome
CMAKE_ARGS="-DCMAKE_INSTALL_PREFIX=/opt/awesome" make
```
#### <blockquote>commands
mod + shift + tag-number: move window to specified tag number.  
mod + ctrl + shift + tag-number: duplicate window to specified tag number.  
mod + shift + ,: move window to left/previous tag number.  
mod + shift + .: move window to right/next tag number.  

Install xcompmgr:  
```bash
sudo aptitude install xcompmgr
# the best is:
compton -cCGfF -o 0.38 -O 200 -I 200 -t 0 -l 0 -r 3 -D2 -m 0.88
awful.util.spawn_with_shell("compton -cCGfF -o 0.38 -O 200 -I 200 -t 0 -l 0 -r 3 -D2 -m 0.88")

# Near the top of your rc.lua:
awful.util.spawn_with_shell("xcompmgr -cF &")
```

