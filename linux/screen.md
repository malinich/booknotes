
screen -S some-name  # обозвать сессию  
screen -S some-name -X quit  # убить сессию  

Ctrl+A затем d  
after some time  
screen -ls  
screen -r 20673.pts-0.srv  

Ctrl+A затем «c» — создать окно screen  
Ctrl+A затем «p» — переключиться к предыдущему окну screen  
Ctrl+A затем «n» — переключиться к следующему окну screen  
Ctrl+A затем «d» — отключиться от screen оставив сеансы работающими  
Ctrl+D — выйти из всех сеансов screen  
Ctrl+A затем «H» — записывать в журнал   
  
Переключение между окнами Ctrl+a; TAB, выход из режима сплит - Ctrl+a Q.   
Ctrl+a C - очистить окно.  
Ctrl+a F - подогнать размер окна под текущий размер терминала.  
Ctrl+a H - протоколирование окна в файл screenlog.<НОМЕР ОКНА>  
Ctrl+a K - уничтожить окно.  
Ctrl+a M - режим слежения за активностью в окне. Если в момент этого вы находитесь в другом окне - в подсказке будет выведено:activity in window <НОМЕР ОКНА>  
Ctrl+a r - переключение режима переноса по словам. (wrap)  
Ctrl+a S - очень интересный режим работы. Сплит. То-есть текущее окно разделяется на две части и в обоих можно открыть по новому окну.   

Ctrl+a ? - помощь  
Ctrl+a Esc - режим скроллинга. Он же режим копирования. Для копирования подведите курсор к нужному месту и нажмите пробел.  
Ctrl+a ] - Вставка выделенной области.   

rd - подключиться к screen. Сделать deatach для остальных сессий.  
list/-ls - список запущенных менеджеров.  
dm - запуск screen в режиме deatach. Полезно для init скриптов или скриптов вообще.  
wipe - удалить сведения о запущенных менеджерах. Полезно в случае потери менеджера, но сохранения информации о нем.  
x - присоединиться к screen. Присоединение осуществляется даже в случае существующих соединений. Полезно при работе с одним screen из разных окружений. Например один screen и на X и на консоль. ;)   
