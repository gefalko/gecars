import {Gumtree} from "../providers/gumtree/gumtree";
import {Ad} from "../models/ad/AdModel";
import {httpRequest} from "./httpRequest";
import { map } from 'lodash'

const mongoose = require('mongoose');
require('./../models/db');

const autotraderCtrl = require('./../providers/autotrader/autotraderCtrl');
const ebay = require('./../providers/Ebay/ebay');

const httpSer = require('./http.service.js');

const colors = require('colors');

const debug = true;

export const collect = async (strategy, filter) => {

  console.log("------------------------PROVIDER IS:"+strategy+"----------------------------------");

  const addFilterIdAndProvider = (ads) => {
    console.log('addFilterIdAndProvider', ads)
    return map(ads, ad => {return { ...ad, strategy }})
  }

  try{
    switch (strategy) {
      case 'gumtree':
        return []
        //return  addFilterIdAndProvider(await new Gumtree(new httpRequest()).getNewAds(filter))
      case 'autotrader':
       return addFilterIdAndProvider(await autotraderCtrl.getFiltrededAds(filter, httpSer))
      case 'ebay':
        return addFilterIdAndProvider(await ebay(filter))
    }
  }catch (err){
    console.log(err.stack);
    console.log(err);
  }
}

export const  collectOrder =  (order) => {
  function insertMany(_ads) {
    return new Promise(function (resolve) {
      console.log("COLLECTING FINISHED NEW ADS SIZE[" + _ads.length + "]".yellow);

      if (_ads.length == 0) {
        resolve([]);
        return;
      }

      Ad.collection.insertMany(_ads).then(function (ads) {

        console.log("Res from db after insert many operation:");
        console.log(ads);
        resolve(_ads);
      });
    })
  }

  // format ads fromat. Ads come from providers in format [{url, ads[]}, ... ]

  function formatAds(ads) {
    const resArray = [];
    for (let adsArray of ads) {

      resArray.push.apply(resArray, adsArray.ads);
    }
    return resArray;
  }

  async function init() {

    //order.filters = [order.filters[0],order.filters[1]];

    let newAds = [];

    for (const filter of order.filters) {
      for (const provider of filter.providers) {

        try {
          console.log((`${new Date().toLocaleString()}] Collect ${provider.name} of filter ${filter.make.make} ${filter.modelType.name}`).red);

          const ads = await collect(provider.name, filter);


          if (ads.ads) {
            newAds.push.apply(newAds, formatAds(ads));
          } else {
            newAds.push.apply(newAds, ads);
          }


          console.log(("New ads of folter [" + ads.length + "]").red + (`Total ads [${newAds.length}]`).cyan.bold);

          console.log('=====================================================================================');

        } catch (err) {
          console.log(`ERROR with filter ${filter._id} provider ${provider.name}`);
          console.log(err);
        }

      }
    }

    return await insertMany(newAds);

  }

  return init();
}



