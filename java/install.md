```bash
# strange validate and debug
readelf -l /usr/bin/java
ldd /usr/bin/java

# <!----
## delete open-jdk
>>> refs: http://askubuntu.com/questions/430434/replace-openjdk-with-oracle-jdk-on-ubuntu

# 1. Remove OpenJDK completely by this command:
sudo apt-get purge openjdk-\*

# 2. Download the Oracle Java JDK 
>>> refs: http://www.oracle.com/technetwork/java/javase/downloads/index.html

# 3. Create a folder named java in /usr/local/by this command:
sudo mkdir -p /usr/local/java

# 4. copy
sudo cp -r jdk-8u51-linux-x64.tar.gz /usr/local/java/
cd /usr/local/java
sudo tar xvzf jdk-8u51-linux-x64.tar.gz

# 5. Update PATH file by opening  /etc/profile file by the command sudo nano /etc/profile and paste the following at the end of the file:
JAVA_HOME=/usr/local/java/jdk1.8.0_51
PATH=$PATH:$HOME/bin:$JAVA_HOME/bin
export JAVA_HOME
export PATH

# 6. Tell the system that the new Oracle Java version is available by the following commands:
sudo update-alternatives --install "/usr/bin/java" "java" "/usr/local/java/jdk1.8.0_51/bin/java" 1
sudo update-alternatives --install "/usr/bin/javac" "javac" "/usr/local/java/jdk1.8.0_51/bin/javac" 1
sudo update-alternatives --install "/usr/bin/javaws" "javaws" "/usr/local/java/jdk1.8.0_51/bin/javaws" 1

# 7. Make Oracle Java JDK as default by this following commands:
sudo update-alternatives --set java /usr/local/java/jdk1.8.0_51/bin/java
sudo update-alternatives --set javac /usr/local/java/jdk1.8.0_51/bin/javac
sudo update-alternatives --set javaws /usr/local/java/jdk1.8.0_51/bin/javaws

# end
source /etc/profile
Reboot your system.
chec

```
