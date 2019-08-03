const mongoose = require('mongoose');
let Make = mongoose.model('Make');
let Model = mongoose.model('Model');
let Filter = mongoose.model('Filter');
let Provider = mongoose.model('Provider');


function init(msg){

    console.log("Init filters setup : "+msg);

    const Sync = require('sync');

    function getMakeId(make,callback){
        console.log("getMakeId->",make);
        Make.findOne({ 'make': make }, function (err, make) {
            if (!err){
                console.log("No Error make",make);
                callback(null,make);
            }else{
                console.log("Error",err);
            }
        })
    }

    function getProvider(name,callback){
        Provider.findOne({ 'name': name }, function (err, Provider) {
            if (!err){
                console.log("No Error Provider",Provider);
                callback(null,Provider);
            }else{
                console.log("Error",err);
            }
        })
    }

    function getModelId(model, makeId, callback){
        console.log("getModelId->",model,makeId);
        Model.findOne({ 'name': model}, function (err, model) {
            if (!err){
                console.log("no Error model",model);
                callback(null,model);
            }else{
                console.log("Error",err);
            }
        })
    }

    return new Promise(function(resolve){
        Sync(function(){

            console.log("Setting filter");

            let filters = [
                {
                    make: 'bmw',
                    model:'X5',
                    yearFrom:2013,
                    yearTo:2016,
                    priceFrom:0,
                    priceTo:3500
                },{
                    make:'bmw',
                    model:'530',
                    fuel:'petrol',
                    yearFrom:1990,
                    yearTo:2016,
                    priceFrom:0,
                    priceTo:1200
                },{
                    make:'bmw',
                    model:'530',
                    fuel:'diesel',
                    yearFrom:2003,
                    yearTo:2016,
                    priceFrom:0,
                    priceTo:2300
                },
                {
                    make:'bmw',
                    model:'523',
                    fuel:'petrol',
                    yearFrom:2003,
                    yearTo:2016,
                    priceFrom:0,
                    priceTo:2500
                },
                {
                    make:'chevrolet',
                    model:'cruze',
                    fuel:'petrol',
                    priceFrom:0,
                    priceTo:2200,
                    yearFrom:1990,
                    yearTo:2016
                },
                {
                    make:'chevrolet',
                    model:'lacetti',
                    fuel:'petrol',
                    priceFrom:0,
                    priceTo:800,
                    yearFrom:1990,
                    yearTo:2016
                },
                {
                    make:'honda',
                    model:'accord',
                    fuel:'petrol',
                    priceFrom:0,
                    priceTo:1500,
                    yearFrom:2006,
                    yearTo:2016
                },
                {
                    make:'lexus',
                    model:'rx',
                    priceFrom:0,
                    priceTo:2200,
                    yearFrom:2003,
                    yearTo:2016
                },
                {
                    make:'lexus',
                    model:'gs',
                    priceFrom:0,
                    priceTo:2200,
                    yearFrom:2003,
                    yearTo:2016
                },
                {
                    make:'mazda',
                    model:'3',
                    fuel:'petrol',
                    priceFrom:0,
                    priceTo:1300,
                    yearFrom:2004,
                    yearTo:2007
                },
                // e-class have more modifications like e 2000 (2.0 engine size)
                // gumtree only allow filter by class so in future need add engine parser
                {
                    make:'mercedes-benz',
                    model:'e-class',
                    priceFrom:0,
                    priceTo:2000,
                    yearFrom:2003,
                    yearTo:2016
                },
                {
                    make:'mitsubishi',
                    model:'l200',
                    priceFrom:0,
                    priceTo:2800,
                    yearFrom:2006,
                    yearTo:2016
                },
                {
                    make:'mitsubishi',
                    model:'outlander',
                    priceFrom:0,
                    priceTo:1600,
                    yearFrom:2006,
                    yearTo:2016
                },
                {
                    make:'mitsubishi',
                    model:'lancer',
                    priceFrom:0,
                    priceTo:1300,
                    yearFrom:1990,
                    yearTo:2016
                },
                {
                    make:'mitsubishi',
                    model:'shogun-sport',
                    priceFrom:0,
                    priceTo:1200,
                    yearFrom:1990,
                    yearTo:2016
                },
                {
                    make:'mitsubishi',
                    model:'grandis',
                    priceFrom:0,
                    priceTo:1200,
                    yearFrom:1990,
                    yearTo:2016
                },
                {
                    make:'mitsubishi',
                    model:'colt',
                    fuel:'petrol',
                    priceFrom:0,
                    priceTo:900,
                    yearFrom:1990,
                    yearTo:2016
                },
                {
                    make:'nissan',
                    model:'qashqai',
                    priceFrom:0,
                    priceTo:2700,
                    yearFrom:1990,
                    yearTo:2016
                },
                {
                    make:'skoda',
                    model:'superb',
                    fuel:'petrol',
                    priceFrom:0,
                    priceTo:900,
                    yearFrom:1990,
                    yearTo:2016
                },
                {
                    make:'skoda',
                    model:'octavia',
                    priceFrom:0,
                    priceTo:800,
                    yearFrom:2001,
                    yearTo:2004
                },
                {
                    make:'subaru',
                    model:'tribeca',
                    priceFrom:0,
                    priceTo:3000,
                    yearFrom:1990,
                    yearTo:2008
                },
                {
                    make:'subaru',
                    model:'forester',
                    priceFrom:0,
                    priceTo:1200,
                    yearFrom:2002,
                    yearTo:2004
                },
                {
                    make:'subaru',
                    model:'forester',
                    priceFrom:0,
                    priceTo:2200,
                    yearFrom:2005,
                    yearTo:2007
                },
                {
                    make:'subaru',
                    model:'outback',
                    fuel:'petrol',
                    priceFrom:0,
                    priceTo:2500,
                    yearFrom:2006,
                    yearTo:2008
                },
                {
                    make:'subaru',
                    model:'outback',
                    fuel:'petrol',
                    priceFrom:0,
                    priceTo:1500,
                    yearFrom:2004,
                    yearTo:2006
                },
                {
                    make:'toyota',
                    model:'camry',
                    priceFrom:0,
                    priceTo:1500,
                    yearFrom:2002,
                    yearTo:2016
                },
                {
                    make:'toyota',
                    model:'landcruiser',
                    priceFrom:0,
                    priceTo:3500,
                    yearFrom:2003,
                    yearTo:2016
                },
                {
                    make:'volkswagen',
                    model:'passat',
                    priceFrom:0,
                    priceTo:1300,
                    yearFrom:2005,
                    yearTo:2016
                }

            ]

            let _filters = [];

            const gumtree = getProvider.sync(null,'gumtree');

            for(let filter of filters){

                const make = getMakeId.sync(null, filter.make);
                console.log("sync make",make);
                const model = getModelId.sync(null,filter.model,make._id);
                console.log("sync model",model);

                filter.make = make._id;
                filter.model = model._id;
                filter.providers = [gumtree._id];

                filter = new Filter(filter);
                filter.save();

                _filters.push(filter._id);
            }

            console.log("Setting filter result ",_filters);

            resolve(_filters);

        })
    })
}


module.exports = {init:init};





