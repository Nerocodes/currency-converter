"use strict"

document.getElementById('convert').addEventListener("click", function(){
    let amount = document.getElementById('amount');
    let from = document.getElementById('from').value;
    let to = document.getElementById('to').value;
    let convert = `${from}_${to}`;

    let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${convert}&compact=${amount}`;

    fetch(url).then(function(response){
        return response.json();
    })
    .then(function(myJson){
        document.getElementById('result').innerHTML = myJson.results[convert].val;
        console.log(myJson.results[convert].val);
    });

    
    


});


