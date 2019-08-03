"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpRequest_1 = require("../services/httpRequest");
const mongoose = require('mongoose');
require('./../models/db');
const UserModel_1 = require("../models/user/UserModel");
const FilterModel_1 = require("../models/filter/FilterModel");
const ser = require('./../services/data.service');
const gumtree_1 = require("../providers/gumtree/gumtree");
const autotraderCtrl = require('./../providers/autotrader/autotraderCtrl');
const ebay = require('./../providers/Ebay/ebay');
const httpSer = require('./../services/http.service.js');
const args = process.argv.slice(2).reduce((res, cur) => {
    const arg = cur.split('=');
    res[arg[0]] = arg[1];
    return res;
}, {});
const { providerForTest, filterId, printAds, printFilter, priceTo, yearFrom, yearTo } = args;
console.log('command args:', args);
function testAll(filter) {
    return __awaiter(this, void 0, void 0, function* () {
        yield testEbay(filter);
        yield testGumtree(filter);
        yield testAutotrader(filter);
        return true;
    });
}
function resPrinter(ads) {
    console.log(('----------------- From test file ----------------------------').red);
    console.log("Total new ads:", ads.length);
    for (let ad of ads) {
        console.log(("Found new add -> " + ad.url).green);
        if (printAds) {
            console.log(ad);
        }
    }
}
function testEbay(filter) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("=============================================================".red);
            console.log(`Testing ${filter.make.make} ${filter.modelType.name} `.red);
            console.log("=============================================================".red);
            console.log(`ebay `.red);
            console.log("-------------------------------------------------------------".red);
            resPrinter(yield ebay(filter));
            console.log("-------------------------------------------------------------".red);
        }
        catch (err) {
            console.log('Err on ebay');
            console.log(err);
        }
    });
}
function testAutotrader(filter) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("-------------------------------------------------------------".red);
            console.log(`autotrader `.red);
            console.log("-------------------------------------------------------------".red);
            let ads = yield autotraderCtrl.getFiltrededAds(filter, httpSer, (url) => {
                console.log(url);
            });
            resPrinter(ads);
            console.log("-------------------------------------------------------------".red);
        }
        catch (err) {
            console.log("Autotrader err in testing");
            console.log(err);
        }
    });
}
function testGumtree(filter) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("-------------------------------------------------------------".red);
            console.log(`gumtree `.red);
            console.log("-------------------------------------------------------------".red);
            const ads = yield new gumtree_1.Gumtree(new httpRequest_1.httpRequest()).debugModeOn().getNewAds(filter);
            resPrinter(ads);
            console.log("-------------------------------------------------------------".red);
        }
        catch (err) {
            console.log("Err on gumtree");
            console.log(err);
        }
        return true;
    });
}
const formatFilterByParams = (filter, params) => {
    return Object.assign({}, filter, { params });
};
UserModel_1.User.findOne({ email: 'ge4cars@gmail.com' }).populate('orders').exec(function (err, user) {
    console.log('USER', user);
    const filters = user.orders[0].filters;
    console.log("Filter filter id " + filterId + ". Total filters -> " + filters.length);
    FilterModel_1.Filter.findById(filters[filterId]).populate([{ path: 'make', modelType: 'Make' }, {
            path: 'modelType',
            modelType: 'modelType'
        }]).exec().then(function (filter) {
        filter.priceTo = priceTo ? priceTo : filter.priceTo;
        filter.yearFrom = yearFrom ? yearFrom : filter.yearFrom;
        filter.yearTo = yearTo ? yearTo : filter.yearTo;
        try {
            start(filter);
        }
        catch (err) {
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
    console.log("FILTER ON TEST: " + filterId);
    if (printFilter) {
        console.log(filter);
    }
    console.log("**********************************************");
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
