> source [here](https://aur.archlinux.org/packages/awesome-git/)
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

