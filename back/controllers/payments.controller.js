const md5 = require('md5');
const dataSer = require('../services/data.service');
const moment = require('moment');
const sign = 'c61f09172291b2268d13e1b8b8301e43';


function query2json(query){          
    var pairs = query.split('&');
    
    var result = {};
    pairs.forEach(function(pair) {
                pair = pair.split('=');
                        result[pair[0]] = decodeURIComponent(pair[1] || '');
                            
    });

    return JSON.parse(JSON.stringify(result));
}

function extractData(req){

    let data = req.query.data;
    const ss1 = req.query.ss1;
    const ss2 = req.query.ss2;
   
    if(!check(data, ss1))throw new Error('Securety error!');

    // step 1. 
    data = data.replace('-', '+').replace('_', '+');
    // step 2.
    data = Buffer.from(data, 'base64').toString('ascii');
    // step 3.
    return query2json(data);
}

function check(data, ss1){
  return (ss1 === md5(data + sign));
}

module.exports.accept = function(req, res){
    const data =  extractData(req); 
    res.redirect("/p/sucess");
};


module.exports.callback = function(req, res){    
    const data = extractData(req);

    dataSer.findOrderById(data.orderid).then(function(order){
        
        dataSer.createTransaction(data).then(function(transaction){
            
            console.log("Payed order: paysera data->", data);

            order.payed = true;
            order.active = true;
            order.start = Date.now();
            order.end = moment(order.start).add(order.duration, 'months').toDate();
            order.transactions.push(transaction._id);

            order.save().then(function(){
                console.log("order from db -> ",order);
                res.send(200,'OK');
            });

        });
    });


};


module.exports.cancel = function(req, res){
    
    console.log("cancel payment");
     
    res.send(200,'ok');
};
