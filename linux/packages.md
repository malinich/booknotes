#### <blockquote>Adding PPA
```bash
apt-key list
sudo apt-key del 30C18A2B

sudo add-apt-repository ppa:user/ppa-name
sudo apt-get update

# Once the key hash is known, the key can then be retrieved using the command:
# gpg --keyserver [name of keyserver] --recv-keys [keyhash]

edit /etc/apt/source.list  
# keyserver maybe is keyserver.ubuntu.com
gpg --keyserver subkeys.pgp.net --recv-keys CE49EC21 
Then, add the key to Ubuntu's apt trusted keys database with the following command:
gpg --export --armor CE49EC21 | sudo apt-key add - 

# search lib
apt-file search libXss.so

# alien
#установка рем пакетов
sudo alien package _file.rpm 

# установка alien
sudo apt-get install alien  

#### <blockquote> dpkg
dpkg [ключи] действие
sudo dpkg -i /путь/файл.deb установить
sudo dpkg -r пакет удолить
dpkg -l вывести список установленных пакетов
dpkg -L вывести имена фаалов из указанных пакетов
dpkg -p вывести информацию об установленном пакете


#### <blockquote>update google-chrome
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt-get update
sudo apt-get --only-upgrade install google-chrome-stable
