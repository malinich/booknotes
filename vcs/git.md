#### add keys in session
```
eval $(ssh-agent -s)
ssh-add ~/.ssh/github
```
#### clear log
```
echo "" > $(docker inspect --format='{{.LogPath}}' 0a014706d6c7)  # container-id
```

#### configs
```
# ignore files mod
git config core.filemode false

# end of file 
git config --global core.autocrlf true
```
#### save credentials
```
git config credential.helper store
git pull
```
#### <blockquote> install
```
apt-get install git
```

#### <blockquote> first start
```
# git init
mkdir /path/to/your/project
cd /path/to/your/project
git init
git remote add origin https://malinich@bitbucket.org/malinich/lifeto-front.git

# Create your first file, commit, and push
echo "Igor malinov" >> contributors.txt
git add contributors.txt
git commit -m 'Initial commit with contributors'
git push -u origin master
```
```
git config --global core.autocrlf true
```

> first
```
Quick setup — if you’ve done this kind of thing before
 Set up in Desktop	or	
 HTTPS
 SSH

https://github.com/malinich/settings.git

We recommend every repository include a README, LICENSE, and .gitignore.

…or create a new repository on the command line

echo "# settings" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/malinich/settings.git
git push -u origin master
…or push an existing repository from the command line

git remote add origin https://github.com/malinich/settings.git
git push -u origin master
```
