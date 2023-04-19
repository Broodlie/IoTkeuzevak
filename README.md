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
https://youtube.com/shorts/38bVAmcKxrU?feature=share

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

Nu kunner er 4 variablen aangemaakt worden om met thingspiek te communiceren via wifi.

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

Vervolgens kan je deze key in de api key variable schrijven.

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
Nu kan je de code runnen en zou je de data van de LDR op thingspeak zien verschijnen.

## webApp

Om de webApp te kunnen maken heb je eerst Nodejs nodig, dit kan je in de volgende link downloaden: https://nodejs.org/en 

Als je nodejs hebt gedownload kan je nu een lege folder aan maken en je cmd openen hierin. 
vervolgens kan je de volgende commands uitvoeren 

```
npm init
```
Beantwoord alles met ja, en voer de volgende command uit

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
Hierna worden er eindpoints gemaakt om naar de html pagina te gaan en om een json bestand te versturen naar de webpagina met de data van thingspeak.

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

Om de server optestarten gebruiken we de volgende stuk code.
de server staat op een localhost, alleen mensen van de zelfde netwerk kunnen op de webpagina komen.
```js
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

```
De volgende functie haalt de data van thingspeak op.

LET OP! op de plek met **** moet je read a channel feed url komen van thingspeak.

De setInterval functie zorgt ervoor dat elke 3 seconden nieuwe informatie wordt opgehaald.
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
Dit is de volledige back end, nu gaan we de front end maken.

Voor de webpagina is html nodig, maak een bestand genaamd index.html en kopieer de volgende code.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1 class="eerste">-</h1>
    <h2 class="tweede">-</h2>
    <script src="front.js"></script>
    <img class="Cat">
</body>
</html>
```

in deze code worden er drie calssen gemaakt, in class "eerste" wordt de data van de sensor in geschreven. in de tweede class gaan we een foto in zetten die vervolgens veranderd wordt. en de derde class "Cat" is voor de foto 


 Maak nu in de zelfde folder als index.js een public folder aan met hierin een front.js file.

de eerste functie fetchdata haald de juiste data (de LDR waardes) uit de juiste field.

```js
$(document).ready(function(){

    //haalt de data uit de juiste field
    fetchdata = function(){
        fetch('/data').then(response => response.json()).then (jsonD => {

            $(".eerste").text(jsonD["feeds"][0]["field1"]) 
        });
    }
})
```
hierna maken we de functie fetcheck om de afbeelding en tekst te veranderen gebaseerd op de LDR waarde. 
```js
//kijkt wat de waarde van de LDR is en past de pagina hierop aan
fetcheck = function(){
    data = $(".eerste").text()    
    if(data <= 500){

        $(".tweede").text("is uw koelkast open: JAAA!")
        $(".Cat").attr("src","SadCat.jpg");
    }
    else{
    $(".tweede").text("is uw koelkast open: nope")
    $(".Cat").attr("src","HappyCat.jpg");
    }
}
```

dan zorgen we ervoor dat de dat en het veranderen van de afbeelding en tekst om de twee seconden gebeurd.

```js
//pagina wordt gerefreshed om de 2 seconden
setInterval(function(){
    fetchdata()
    fetcheck()
},2000)
```
de afbeeldingen die je wilt gebruiken moet je in de public folder opslaan. Ook moet je de naam "SadCat.jpg" en "HappyCat.jpg" veranderen naar de naam van de zelfgekozen afbeeldingen.


als laatst maken we in de public folder een style.css file aan om de achtergrond kleur te kunnen veranderen.
```css
body{  
    background-color: lightcyan;
}
```
Nu alle code geschreven is kan je naar de folder gaan waar alle code van de webApp in staat. vervolgens cmd in de zoekbalk schrijven en de volgende command uitvoeren

```
node index.js
```
ga naar de localhost:3000 in je browser.
als het goed is zie je nu je eigen webApp.