import network
import urequests
import utime as time
from time import sleep
import machine

ssid = '***'
password = '***'
THINGSPEAK_WRITE_API_KEY = '***'
HTTP_HEADERS = {'Content-Type': 'application/json'} 

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
#stuurt data naar thingspeak
while True:
    ldr = machine.ADC(27) 
    reading = ldr.read_u16()
    time.sleep(5) 
    dht_readings = {'field1':reading} 
    request = urequests.post( 'http://api.thingspeak.com/update?api_key=' + THINGSPEAK_WRITE_API_KEY, json = dht_readings, headers = HTTP_HEADERS )  
    request.close() 
    print(dht_readings) 
    
