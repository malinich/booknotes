+ [security_guidelines](https://core.telegram.org/mtproto/security_guidelines)
+ [api](https://core.telegram.org/bots/api)
+ [how to](https://github.com/rubenlagus/TelegramBots/blob/master/HOWTO.md)
+ [bots](https://core.telegram.org/bots)

docker run -d -p443:443 --name=mtproto-proxy --restart=always -v proxy-config:/data telegrammessenger/proxy:latest
docker logs mtproto-proxy
