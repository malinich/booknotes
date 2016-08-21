# first need install gpg2, gnugpg2
# install keyserver FREE PGP KEY SERVER
sudo apt-get install sks
sudo sks build
sudo chown -Rc debian-sks:debian-sks /var/lib/sks/DB
set initstart=yes in /etc/default/sks
sudo /etc/init.d/sks start
# see http://your.server.name:11371

# GENERATE A KEYPAIR
gpg2 --gen-key

# create armor
gpg --export -a "User Name" > public.key

# open your site and enter this key


# Once the key hash is known, the key can then be retrieved using the command:
```bash
# gpg --keyserver [name of keyserver] --recv-keys [keyhash]
# crypt message
# v1
echo "hello" | gpg --symmetric --armor --passphrase "asdf"
# or 
echo "hello" | gpg --encrypt --armor -r B230230D 
cat encrypted_message | gpg

# v2         
gpg --armour --symmetric my_file
# enter passphrase:

# v3
gpg --armour --symmetric 
# enter passphrase:
# enter text:
 
gpg --decrypt --passphrase "oka"
# copy text

# v pro
gpg --armour  --symmetric --passphrase "oka" >/tmp/2
cat /tmp/2|base64
echo "LS0tLS1CRUdJ....Qytp"|base64 --decode |gpg --decrypt --passphrase "oka"

```
