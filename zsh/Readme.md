> run root under zsh

```
zsudo() sudo zsh -c '"$0" "$@"' "$@" 
# type
zsudo
# or
zsudo() sudo zsh -c "$(functions)"'; "$0" "$@"' "$@"
```
