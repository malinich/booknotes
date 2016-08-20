## <a class="highlight">mount</a>
```bash
# mount from user
sudo mount -t vfat -o umask=0022,gid=1000,uid=1000 /dev/sdb4 /mnt/  
# use other options by this
mount -t "vfat" -o "uhelper=udisks2,nodev,nosuid,uid=1000,gid=1000,shortname=mixed,dmask=0077,utf8=1,showexec,flush" "/dev/sdb1" "/media/maka/4E29-3255"

```
