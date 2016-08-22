#### <blockquote>install
```bash
git clone https://github.com/yyuu/pyenv.git ~/.pyenv  
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
exec $SHELL

pyenv install 3.3.2
pyenv rehash

# pip
# fix pip
curl https://bootstrap.pypa.io/get-pip.py | python
pip install virtualenvwrapper
echo 'WORKON_HOME' >> ~/.bashrc

mkdir -p $WORKON_HOME
mkdir -p ~/.pyenv/plugins

git clone git://github.com/yyuu/pyenv-virtualenvwrapper.git ~/.pyenv/plugins/pyenv-virtualenvwrapper

pyenv virtualenvwrapper
mkvirtualenv name

```