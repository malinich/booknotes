#### create self-signed cert
```bash
# create
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./deploy.key -out ./deploy.crt

# convert to pem
sudo openssl x509 -in deploy.crt -out deploy.pem -outform PEM
 
```
