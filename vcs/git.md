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
