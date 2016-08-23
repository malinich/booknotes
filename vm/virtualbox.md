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
