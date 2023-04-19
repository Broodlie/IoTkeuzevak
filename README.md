# IoTkeuzevak
 IoT project met LDR

## Introductie:

 voor dit IoT project gaan we een systeem maken die kijkt of je koelkast open of dicht is.
 Dit wordt gemaakt met behulp van een LDR senor, raspberry pi pico, thingspeak account en een nodejs server om 
 te kunnen kijken of je koelkast open of dicht is.
Zo verstuurd de raspberry pi met wifi de gegevens van de LRD naar thingspeak. de nodejs server vraagt deze gevens van thingsspeak 
om zo aan te kunnen geven of je koelkast open of dicht staat.
 
## Pipeline:
![image](https://user-images.githubusercontent.com/115473282/232488705-e226af8a-86a3-4c4a-a2ea-f666278bd9f5.png)


## Demovideo:
*zie IoTDemo.mp4 video 

## Benodigdheden:
- LDR sensor
- Raspberry pi pico W
- 2 jump wires
- micro usb kabel
- Thingsspeak account
- Thonny

## Hardware:
Om de Hardware voor dit project te kunnen maken hebben we de Raspberry pi pico w, LDR sensor en de 2 jump wires nodig.
De Raspberry pi pico W moet wel eerst geflashed worden voordat er mee gewerkt kan worden. Dit kan je doen met behulp van de volgende link: https://projects.raspberrypi.org/en/projects/get-started-pico-w/1

als je dat hebt gedaan kunnen we de bekabeling aansluiten.

![image](https://user-images.githubusercontent.com/115473282/232494034-e0017f7c-e127-4d10-9462-6dbddb1bfc87.png)

De zwarte kabel is de ground en moet dus in de GND/pin 38, de groene kabel is waar de data vandaan komt en moet in  pin 27. 
Het maakt voor de LDR niet uit aan welke kant je deze twee kabels aansluit.


## Code LDR/Raspberry pi pico w:

Voordat er gecodeerd gaat worden moet er eerst thonny gedowload worden. 
Dit kan via de volgende link: https://thonny.org/

Als je dit gedaan hebt kan je in thonny een nieuwe file maken, ik heb hem LDR.py genoemd.
Vervolgens kan je de libraries aan je file toevoegen 
```py
import network
import urequests
import utime as time
from time import sleep
import machine
```

nu kunner er 4 variablen aangemaakt worden om met thingspiek te communiceren via wifi.

In de variablen ssid en password moet je nog de naam en wachtwoord van je wifi invullen.

```py
ssid = ''
password = ''
THINGSPEAK_WRITE_API_KEY = ''
HTTP_HEADERS = {'Content-Type': 'application/json'} 
```

Voor de thingspeak api key moet je eerst naar thingspeak gaan, inloggen en bij my channels een new channel aanmaken.
Er moet minimaal 1 field aangevinked zijn. In deze field is de waarde van je LDR te zien.

Als je vervolgens naar API key gaat kan je daar de WRITE api key vinden
![image](https://user-images.githubusercontent.com/115473282/232504049-59c6ba5f-8fd9-4409-9711-ff7ab392c67f.png)
![image](https://user-images.githubusercontent.com/115473282/232504081-642c3b41-3d75-478a-8406-5167d3773507.png)

vervolgens kan je deze key in de api key variable schrijven.

De HTTP_HEADERS gaat gebruikt worden om de LDR data te versturen naar thingspeak

Om nu met het wifi te connecten maken we de connect functie.

```py
def connect():
    #Connect to WLAN
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)
    while wlan.isconnected() == False:
        print('Waiting for connection...')
        sleep(1)
    ip = wlan.ifconfig()[0]
    print(f'Connected on {ip}')
      return ip

connect()
```

Als laast moeten we de LDR waardes van pin 27 ophalen en versturen naar thingspeak.
Dit gebeurd in 

```py
while True:
    ldr = machine.ADC(27) 
    reading = ldr.read_u16()
    time.sleep(5) 
    dht_readings = {'field1':reading} 
    request = urequests.post( 'http://api.thingspeak.com/update?api_key=' + THINGSPEAK_WRITE_API_KEY, json = dht_readings, headers = HTTP_HEADERS )  
    request.close() 
    print(dht_readings) 
```
nu kan je de code runnen en zou je de data van de LDR op thingspeak zien verschijnen.

## webApp

Om de webApp te kunnen maken heb je eerst Nodejs nodig, dit kan je in de volgende link downloaden: https://nodejs.org/en 

Als je nodejs hebt gedownload kan je nu een lege folder aan maken en je cmd openen hierin. 
vervolgens kan je de volgende commands uitvoeren 

```
npm init
```
beantwoord alles met ja, en voer de volgende command uit

```
npm express
```
Maak nu de index.js file aan. dit word de back-end van de webApp.

Als eerst maken we wat variable aan en include we een librarie 
Ook maken we data aan. hierin wordt de data van thingsspeak in opgeslagen.
```js
const port = 3000
const express = require('express')
const app = express()
const path = require('path');
const request = require('request');

let data
```
hierna worden er eindpoints gemaakt om naar de html pagina te gaan en om een json bestand te versturen naar de webpagina met de data van thingspeak.

```js
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
})
app.get('/data', function(req,res){
  res.type('json').send(data)
})
```
Vervolgens gebruiken we app.use om de public files en json te kunnen gebruiken.
```js
app.use(express.static('public'));
app.use(express.json());
```

om de server optestarten gebruiken we de volgende stuk code.
de server staat op een localhost, alleen mensen van de zelfde netwerk kunnen op de webpagina komen.
```js
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

```
de volgende functie haalt de data van thingspeak op.
LET OP! op de plek met **** moet je read a channel feed url komen van thingspeak
de setInterval functie zorgt ervoor dat elke seconden 
```js
//haalt data uit thingspeak 
let ophaal = function(){
  request('******',(err,res,body) => { //read a Channel feed 
  
  data = JSON.parse(body)
  console.log(data)

  });
}
//informatie wordt om de 3 seconden opgehaald 
setInterval(function(){
  ophaal()
}, 3000)

```
