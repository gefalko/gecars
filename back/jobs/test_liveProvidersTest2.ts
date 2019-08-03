import {httpRequest} from "../services/httpRequest";
const mongoose = require('mongoose');
require('./../models/db');

import {User} from "../models/user/UserModel";
import {Filter} from "../models/filter/FilterModel"

const ser = require('./../services/data.service');

import {Gumtree} from '../providers/gumtree/gumtree';
import {AdInterface} from "../models/ad/AdInterface";

const autotraderCtrl = require('./../providers/autotrader/autotraderCtrl');
const ebay = require('./../providers/Ebay/ebay');

const httpSer = require('./../services/http.service.js');

const args: IArgs = process.argv.slice(2).reduce((res, cur) => {
  const arg = cur.split('=')
  res[arg[0]] = arg[1]
  return res
}, {});

const { providerForTest, filterId, printAds, printFilter, priceTo, yearFrom, yearTo} =  args

console.log('command args:', args)

async function testAll(filter) {

    await testEbay(filter);
    await testGumtree(filter);
    await testAutotrader(filter);

    return true;
}

function resPrinter(ads: AdInterface){
    console.log(('----------------- From test file ----------------------------').red)
    console.log("Total new ads:", ads.length);
    for (let ad of ads) {
        console.log(("Found new add -> " + ad.url).green);
        if(printAds){
            console.log(ad);
        }
    }
}

async function testEbay(filter) {
    try {
        console.log("=============================================================".red)
        console.log(`Testing ${filter.make.make} ${filter.modelType.name} `.red)
        console.log("=============================================================".red)
        console.log(`ebay `.red);
        console.log("-------------------------------------------------------------".red)
        resPrinter(await ebay(filter));
        console.log("-------------------------------------------------------------".red)
    } catch (err) {
        console.log('Err on ebay');
        console.log(err);
    }
}

async function testAutotrader(filter) {
    try {
        console.log("-------------------------------------------------------------".red)
        console.log(`autotrader `.red);
        console.log("-------------------------------------------------------------".red)
        let ads = await autotraderCtrl.getFiltrededAds(filter, httpSer, (url) => {
            console.log(url);
        });
        resPrinter(ads);
        console.log("-------------------------------------------------------------".red)
    } catch (err) {
        console.log("Autotrader err in testing");
        console.log(err);
    }
}

async function testGumtree(filter) {

    try {
        console.log("-------------------------------------------------------------".red);
        console.log(`gumtree `.red);
        console.log("-------------------------------------------------------------".red);
        const ads = await new Gumtree(new httpRequest()).debugModeOn().getNewAds(filter);
        resPrinter(ads);
        console.log("-------------------------------------------------------------".red)
    } catch (err) {
        console.log("Err on gumtree")
        console.log(err);
    }

    return true;
}

const formatFilterByParams = (filter, params) => {
  return {...filter, params}
}

User.findOne({email: 'ge4cars@gmail.com'}).populate('orders').exec(function (err, user) {

    console.log('USER', user)

    const filters = user.orders[0].filters

    console.log("Filter filter id " + filterId + ". Total filters -> " + filters.length)


    Filter.findById(filters[filterId]).populate([{path: 'make', modelType: 'Make'}, {
        path: 'modelType',
        modelType: 'modelType'
    }]).exec().then(function (filter) {

        filter.priceTo = priceTo ? priceTo : filter.priceTo
        filter.yearFrom = yearFrom ? yearFrom : filter.yearFrom
        filter.yearTo = yearTo ? yearTo : filter.yearTo

        try {
            start(filter);
        } catch (err) {
            console.log(err.message);
            console.log(err.stack);
        }

    }).catch(err => {
        console.log(err);
    });

});

function start(filter) {
    //filter.yearFrom = 2000;
    //filter.fuel = false;
    //filter.priceTo = 10000;

    console.log("**********************************************");
    console.log("FILTER ON TEST: "+filterId);
    if(printFilter){
        console.log(filter);
    }
    console.log("**********************************************")

    switch (providerForTest) {
        case 'autotrader':
            testAutotrader(filter);
            break;
        case 'gumtree':
            testGumtree(filter);
            break;
        case 'ebay':
            testEbay(filter);
            break;
        default:
            testAll(filter);
    }
}
