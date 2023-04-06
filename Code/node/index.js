const port = 3000
const express = require('express')
const app = express()
const path = require('path');
const request = require('request');

let data //om de data van thingspeak op te slaan 

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
})
app.get('/data', function(req,res){
  res.type('json').send(data)
})


app.use(express.static('public'));
app.use(express.json());
//aangewezen port naar luisteren
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
//haalt data uit thingspeak 
let ophaal = function(){
  request('****************',(err,res,body) => { //get key van thingspeak
  
  data = JSON.parse(body)
  console.log(data)

  });
}
//informatie wordt om de seconden opgehaald 
setInterval(function(){
  ophaal()
}, 1000)


