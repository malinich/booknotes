## connect a Nexus 7 to transfer files? [link][1]  

```bash
sudo apt-get install mtp-tools mtpfs 
mtp-detect | grep idVendor
mtp-detect | grep idProduct

gksu gedit /etc/udev/rules.d/51-android.rules
SUBSYSTEM=="usb", ATTR{idVendor}=="VENDORID", ATTR{idProduct}=="PRODUCTID", MODE="0666"

sudo service udev restart
sudo mkdir /media/GalaxyNexus
sudo chmod a+rwx /media/GalaxyNexus
sudo adduser YOURUSERNAME fuse  # Replace YOURUSERNAME with your Ubuntu user name.

echo "alias android-connect=\"mtpfs -o allow_other /media/GalaxyNexus\"" >> ~/.bashrc
echo "alias android-disconnect=\"fusermount -u /media/GalaxyNexus\"" >> ~/.bashrc
source ~/.bashrc

android-connect
```

[1]: http://askubuntu.com/questions/207569/how-do-i-connect-a-nexus-7-to-transfer-files
