# IoTkeuzevak
 IoT project met LDR

 Introductie:

 voor dit IoT project gaan we een systeem maken die kijkt of je koelkast open of dicht is.
 Dit wordt gemaakt met behulp van een LDR senor, raspberry pi pico, thingsspeak account en een nodejs server om 
 te kunnen kijken of je koelkast open of dicht is.
Zo verstuurd de raspberry pi met wifi de gegevens van de LRD naar thingsspeak. de nodejs server vraagt deze gevens van thingsspeak 
om zo aan te kunnen geven of je koelkast open of dicht staat.
 
Pipeline:
![image](https://user-images.githubusercontent.com/115473282/232488705-e226af8a-86a3-4c4a-a2ea-f666278bd9f5.png)


Demomvideo:


Benodigdheden:
- LDR sensor
- Raspberry pi pico W
- 2 jump wires
- micro usb kabel
- Thingsspeak account
- Thonny

Hardware:
Om de Hardware voor dit project te kunnen maken hebben we de Raspberry pi pico w, LDR sensor en de 2 jump wires nodig.
De Raspberry pi pico W moet wel eerst geflashed worden voordat er mee gewerkt kan worden. Dit kan je doen met behulp van de volgende link: https://projects.raspberrypi.org/en/projects/get-started-pico-w/1

als je dat hebt gedaan kunnen we de bekabeling aansluiten.

![image](https://user-images.githubusercontent.com/115473282/232494034-e0017f7c-e127-4d10-9462-6dbddb1bfc87.png)

De zwarte kabel is de ground en moet dus in de ground, de groene kabel is waar de data vandaan komt en moet in pin 27. 
Het maakt voor de LDR niet uit aan welke kant je deze twee kabels aansluit.


Code LDR/Raspberry pi pico w:

Voordat er gecodeerd gaat worden moet er eerst thonny gedowload worden. 
Dit kan via de volgende link:https://thonny.org/

