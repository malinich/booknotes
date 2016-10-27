#### <blockquote>Resize VirtualBox disk
```bash
# resize your actual virtual disk
VBoxManage modifyhd winXP.vdi --resize 20000
#  Clone your actual virtual disk
VBoxManage clonehd winXP.vdi winXP20.vdi
# Replace your VM current disk with the cloned one
VBoxManage list vms
VBoxManage modifyvm "VirtualMachine Name" --hda none
VBoxManage modifyvm "VirtualMachine Name" --hda winXP20.vdi
# after meed use gparted in liveCD for expand disk
```

delete hdd
```
VBoxManage.exe list hdds
vboxmanage closemedium disk 36315ac8-9f0f-4d23-a00c-fdd07b2d17c5 --delete
```
