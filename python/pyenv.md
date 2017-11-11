#### <blockquote>install
```bash
sudo apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev \
libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev \
xz-utils tk-dev

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
echo 'export WORKON_HOME="$HOME/ENV"' >> ~/.bashrc

mkdir -p $WORKON_HOME
mkdir -p ~/.pyenv/plugins

git clone git://github.com/yyuu/pyenv-virtualenvwrapper.git ~/.pyenv/plugins/pyenv-virtualenvwrapper

pyenv virtualenvwrapper
mkvirtualenv name

```
