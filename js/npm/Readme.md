> install

```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

> show installed global packages

```
npm list -g --depth=0
```

> npm install error - MSB3428: Could not load the Visual C++ component “VCBuild.exe”
```
npm install --global --production windows-build-tools
```
