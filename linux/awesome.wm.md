> prepare
```bash
sudo apt install compton compton-conf
sudo add-apt-repository ppa:slgobinath/safeeyes
sudo apt update
sudo apt install safeeyes
```

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
sudo apt-get install lua5.2-dev
sudo apt-get install asciidoc
sudo apt-get install libxcb
sudo apt-get install libxcb
sudo apt-get install libxcb1
sudo apt-get install libglib2.0-0
sudo apt-get install libglib2.0-bin 
sudo apt-get install libglib2.0
sudo apt-get install libgdk-pixbuf2.0-0
sudo apt-get install libgdk-pixbuf2.0
sudo apt-get install libcairo
sudo apt-get install libxcb-cursor
sudo apt-get install libxcb-cursor-dev 
sudo apt-get install libxcb-randr0-dev 
sudo apt-get install libxcb-xtest
sudo apt-get install libxcb-xtest0
sudo apt-get install libxcb-xtest0-dev 
sudo apt-get install libxcb-xinerama0-dev 
sudo apt-get install libxcb-shape0-dev 
sudo apt-get install libxcb-util-dev 
sudo apt-get install keysync 
sudo apt-get install libxcb-keysyms1-dev 
sudo apt-get install libxcb-icccm4-dev 
sudo apt-get install libxcb-xkb-dev 
sudo apt-get install libxcb-xrm-dev 
sudo apt-get install libxdg-basedir
sudo apt-get install libxdg-basedir-dev 
sudo apt-get install libxkbcommon-dev 
sudo apt-get install libxkbcommon-x11-dev 
sudo apt-get install libcairo2-dev 
sudo apt-get install libstartup-notification0-dev 
CMAKE_ARGS="-DCMAKE_INSTALL_PREFIX=/opt/awesome" make
sudo make install
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

