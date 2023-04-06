$(document).ready(function(){

    //haalt de data uit de juiste field
    fetchdata = function(){
        fetch('/data').then(response => response.json()).then (jsonD => {

            $(".eerste").text(jsonD["feeds"][0]["field1"]) 
        });
    }
})

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
//pagina wordt gerefreshed om de 2 seconden
setInterval(function(){
    fetchdata()
    fetcheck()
},2000)

    

