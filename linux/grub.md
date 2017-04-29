```bash
sudo grub
find /boot/grub/stage1
# В ответ получите: (hd0,0)
root (hd0,0)
setup (hd0)
quit

# grub2 поменять разрешение в консоли
    sudo vim /etc/default/grub
    GRUB_GFXMODE=1280x800x8

    GRUB_GFXPAYLOAD_LINUX=keep

# узнать какое поддерживается разрешение -
    hwinfo –framebuffer

# фон
grub
convert image.jpg -colors 14 -resize 640x480 image.xpm
gzip image.xpm
# закидываешь в grub и прописать путь
splashimage=(hd0,1)/grub/image
------------------------------
grub2:
sudo fdisk –l  # Определяем, на каком из наших дисков установлена Ubuntu
sudo mount /dev/sdXY /mnt
sudo grub-install --root-directory=/mnt/ /dev/sdX
sudo update-grub

# Меню загрузки можно изменить: sudo gedit /boot/grub/menu.lst
# Например если на втором разделе была установлена Windows XP то добавьте в конец файла:
title Windows XP
root (hd0,1)
makeactive
chainloader +1
```

reinstall
sudo update-grub
sudo grub-install /dev/sda
sudo update-grub
sudo reboot
