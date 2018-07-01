"use strict"
let dbPromise = idb.open('cc-db', 1, (upgradeDb) => {
    upgradeDb.createObjectStore('exchange_rate');
});

document.getElementById('convert').addEventListener("click", () => {
    let amount = document.getElementById('amount').value;
    let from = document.getElementById('from').value;
    let to = document.getElementById('to').value;
    let convert = `${from}_${to}`;
    let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${convert}&compact=ultra`;

    document.getElementById('result').innerHTML = "Converting...";
    dbPromise.then((db) => {
        let tx = db.transaction('exchange_rate');
        let keyValStore = tx.objectStore('exchange_rate');
        return keyValStore.get(convert);
    }).then((val) => {
        let converted = val[convert] * amount;
            document.getElementById('result').innerHTML = Math.round(converted).toLocaleString();
    }).catch((err) => {
        fetch(url).then((response) => {
            return response.json();
        }).catch((err) => {
            fetch(url).then((r) => {
                console.log('st chance')
                return r.myJson();
            });
            document.getElementById('result').innerHTML = "Click convert button again"; 
        })
        .then((myJson) => {
            dbPromise.then((db) => {
                let tx = db.transaction('exchange_rate', 'readwrite');
                let keyValStore = tx.objectStore('exchange_rate');
                keyValStore.put(myJson, convert);
                return tx.complete;
            }).then(() => {
                console.log('added new rate');
            });
            let converted = myJson[convert] * amount;
            document.getElementById('result').innerHTML = Math.round(converted).toLocaleString();
        });
    });

    

});


//idb

// let dbPromise = idb.open('cc-db', 1, (upgradeDb) => {
//     let keyValStore = upgradeDb.createObjectStore('exchange_rate', {keypath: convert});
//     keyValStore.put(rateJson, convert);
// });





