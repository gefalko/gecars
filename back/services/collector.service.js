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
const gumtree_1 = require("../providers/gumtree/gumtree");
const AdModel_1 = require("../models/ad/AdModel");
const httpRequest_1 = require("./httpRequest");
const lodash_1 = require("lodash");
const mongoose = require('mongoose');
require('./../models/db');
const autotraderCtrl = require('./../providers/autotrader/autotraderCtrl');
const ebay = require('./../providers/Ebay/ebay');
const httpSer = require('./http.service.js');
const colors = require('colors');
const debug = true;
exports.collect = (strategy, filter) => __awaiter(this, void 0, void 0, function* () {
    console.log("------------------------PROVIDER IS:" + strategy + "----------------------------------");
    const addFilterIdAndProvider = (ads) => {
        console.log('addFilterIdAndProvider', ads);
        return lodash_1.map(ads, ad => { return Object.assign({}, ad, { strategy }); });
    };
    try {
        switch (strategy) {
            case 'gumtree':
                return addFilterIdAndProvider(yield new gumtree_1.Gumtree(new httpRequest_1.httpRequest()).getNewAds(filter));
            case 'autotrader':
                return addFilterIdAndProvider(yield autotraderCtrl.getFiltrededAds(filter, httpSer));
            case 'ebay':
                return addFilterIdAndProvider(yield ebay(filter));
        }
    }
    catch (err) {
        console.log(err.stack);
        console.log(err);
    }
});
exports.collectOrder = (order) => {
    function insertMany(_ads) {
        return new Promise(function (resolve) {
            console.log("COLLECTING FINISHED NEW ADS SIZE[" + _ads.length + "]".yellow);
            if (_ads.length == 0) {
                resolve([]);
                return;
            }
            AdModel_1.Ad.collection.insertMany(_ads).then(function (ads) {
                console.log("Res from db after insert many operation:");
                console.log(ads);
                resolve(_ads);
            });
        });
    }
    // format ads fromat. Ads come from providers in format [{url, ads[]}, ... ]
    function formatAds(ads) {
        const resArray = [];
        for (let adsArray of ads) {
            resArray.push.apply(resArray, adsArray.ads);
        }
        return resArray;
    }
    function init() {
        return __awaiter(this, void 0, void 0, function* () {
            //order.filters = [order.filters[0],order.filters[1]];
            let newAds = [];
            for (const filter of order.filters) {
                for (const provider of filter.providers) {
                    try {
                        console.log((`${new Date().toLocaleString()}] Collect ${provider.name} of filter ${filter.make.make} ${filter.modelType.name}`).red);
                        const ads = yield exports.collect(provider.name, filter);
                        if (ads.ads) {
                            newAds.push.apply(newAds, formatAds(ads));
                        }
                        else {
                            newAds.push.apply(newAds, ads);
                        }
                        console.log(("New ads of folter [" + ads.length + "]").red + (`Total ads [${newAds.length}]`).cyan.bold);
                        console.log('=====================================================================================');
                    }
                    catch (err) {
                        console.log(`ERROR with filter ${filter._id} provider ${provider.name}`);
                        console.log(err);
                    }
                }
            }
            return yield insertMany(newAds);
        });
    }
    return init();
};
