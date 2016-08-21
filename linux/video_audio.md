```bash
# записал звук микрофона
avconv -f alsa -i pulse -acodec copy -f x11grab -s 1366x768 -r 25 -i :0.0 -vcodec mpeg2video test.mkv
avconv -f alsa -i hw:0 -acodec libmp3lame -ab 192k -ac 1 -ar 44100 U2012061200.mp3

ffmpeg -f video4linux2 -i /dev/video0 -an -f flv rtmp://localhost/tra/tru

-ffmpeg -i "some_video.vob" -re -vcodec libx264 -vpre default -vpre 
baseline -b 500000 -s 320x180 -strict experimental -g 25 -me_method 
zero -acodec aac -ab 96000 -ar 48000 -ac 2 -b 500K -f flv 
rtmp://127.0.0.1/live/test
-ffmpeg -f video4linux2 -i /dev/video0  -f flv rtmp://127.0.0.1:1935
-ffmpeg -f video4linux2 -i /dev/video0  -vcodec copy - acodec copy -f flv rtmp://127.0.0.1:1935
-ffmpeg -i http://89.232.125.186:3336/stream.flv -an -ss 00:00:03 -an -r 1 -vframes 1 -y %d.jpg
-cvlc -vvv адрес_веб-камеры --http-caching=5000 --sout '#transcode{vcodec=FLV1}:standard{mux=ffmpeg{mux=flv},access=http{mime=video/x-flv},dst=127.0.0.1:8082/stream.flv}'
-acodec libfaac
-vlc -vv rtsp://пользователь:пароль@ip_камеры/axis-media/media.amp  --rtsp-caching=100000 --loop --http-caching=10000 --sout \ 
'#transcode{vcodec=FLV1,vb=512,fps=15}:std{access=http{mime=video/x-flv},dst=ip_сервера:8080/view01.flv,mux=ffmpeg{mux=flv}}'
# --rtsp-caching это буфер с RTSP потока с камера, и измиряется в мс.
# --http-caching - это буфер с HTTP потока на сервере, и измиряется в мс.
# vb - это битрейт видео на выходе
# fps - частота кадров видео на выходе
# dst - это адрес на который будет направлен стриминг, и который нужно будет указать во flash-плеере на сайте.

ffmpeg -f video4linux2 -i /dev/video0  -vcodec mpeg2video -f alsa -i pulse -acodec libmp3lme   -f flv rtmp://localhost/tra/tru
ffmpeg -f video4linux2 -i /dev/video0  -vcodec mpeg2video -f alsa -i pulse -acodec libmp3lame  -ar 22050  -f flv rtmp://localhost/tra/tru
```
audio  
```
amixer -D pulse sset Master 100% on
amixer -c0 sset Capture cap # nocap
```
