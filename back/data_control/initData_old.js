const mongoose = require('mongoose');
require('./../models/db');

const simasData = require('./simasFilters_old');

let Make = mongoose.model('Make');
let Model = mongoose.model('Model');
let User = mongoose.model('User');
let Order = mongoose.model('Order');
let Filter = mongoose.model('Filter');
let Provider = mongoose.model('Provider');
let Ad = mongoose.model('Provider');

let promises = [];

//promises.push(Make.remove({}).exec());
//promises.push(Model.remove({}).exec());
promises.push(User.remove({}).exec());
promises.push(Order.remove({}).exec());
promises.push(Filter.remove({}).exec());
promises.push(Provider.remove({}).exec());
promises.push(Ad.remove({}).exec());



function initData(){

    let createPromises = [];

    let gumtree = new Provider({'name':'gumtree'});


    createPromises.push(gumtree.save());

    let simas = new User({
        email:'ge4cars@gmail.com',
        orders:[]
    });

    createPromises.push(simas.save());

    return createPromises;
}

/* init make */
function initMakeAndModels(){

    let _promises = [];

    let makes = require('./data/make_models');

    for(let make of makes){
        let models = [];
        const makeModels = make.models;
        make = new Make({make:make.make});
        _promises.push(new Promise(function(resolve){

            make.save().then(function(make){
                console.log("Add models to make",make);
                if(makeModels){
                    for(let model of makeModels){
                        model = new Model({name:model});
                        model.make = make._id;
                        model.save();
                        models.push(model._id);
                    }
                }
                make.models = models;
                make.save().then(function(){
                    resolve();
                });
            });

        }));


    }

    return _promises;
}

Promise.all(promises).then(values => {
    console.log("Delete PROMISES");

    Promise.all(initData()).then(function(){

        Promise.all(initMakeAndModels()).then(function(){

            console.log("Make models PROMISES");

            simasData.init('Cool').then(function(filters){

                User.findOne({email:'ge4cars@gmail.com'},function(err, simas){

                    console.log("Update simas",simas);

                    let order = new Order({
                        user:simas._id,
                        filters: filters
                    });

                    order.save().then(function(order){

                        console.log("create order",order);

                        simas.orders.push(order._id);
                        simas.save();
                    });

                })


            });

        });

    });



});






