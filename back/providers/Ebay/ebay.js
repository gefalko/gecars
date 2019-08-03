const request = require('request');
const cheerio = require('cheerio');
const colors = require('colors');

const mongoose = require('mongoose');
require('../../models/db');
let Ad = mongoose.model('Ad');

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports = function (filter) {
  try{
    if (filter.fuel) {
      switch (filter.fuel) {
        case 'petrol':
          filter.fuel = 'Petrol';
          break;
        case 'diesel':
          filter.fuel = 'Diesel';
          break;
      }
    }

    const urlFuel = (filter.fuel ? "&Fuel=" + filter.fuel : '');
    const urlModel = (filter.modelType.providersData && filter.modelType.providersData.ebay ? filter.modelType.providersData.ebay : filter.modelType.name);


    // stop becouse ebay not have this type of module
    if (urlModel == 'not-exist')throw new Error(`ERROR: Module ${filter.modelType.name} not exist in Ebay`.red);

    let extra = '';
    let url;

    if (filter.make.make == 'skoda') {
      url = `http://www.ebay.co.uk/sch/Skoda/18275/i.html?Model=${urlModel.capitalize()}&_udlo=${filter.priceFrom}&_udhi=${filter.priceTo}&_sop=10${urlFuel}${extra}`
    } else {
      url = `http://www.ebay.co.uk/sch/Cars/9801/i.html?Manufacturer=${filter.make.make.capitalize()}&Model=${urlModel.capitalize()}&_udlo=${filter.priceFrom}&_udhi=${filter.priceTo}&_sop=10${urlFuel}${extra}`;
    }

    function asyncRequest(url) {

      if(!url){
        throw 'Url is '+url;
      }

      console.log(("ebay:" ).green.bold + url.green);
      return new Promise(function (resolve) {
        request({
          url: url, //URL to hit
          method: 'GET', //Specify the method
          headers: { //We can define headers too
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
          }
        }, function (error, response, body) {
          resolve(body);
        });
      });
    }

    function toArray(elements) {
      let array = [];
      $(elements).each(function (i, elem) {
        array.push(elem);
      });
      return array;
    }

    function extract(element) {
      let ad = {
        filter: filter._id,
        make: filter.make._id,
        modelType: filter.modelType._id,
      };

      if (filter.fuel) {
        ad.fuel = filter.fuel;
      }


      const details = toArray($(element).find('div.s-item__details div.s-item__detail--secondary'));

      for (let info of details) {
        if ($(info).text().indexOf('Reg. Date:') > -1) {
          if(!$(info).text()){
            throw "ERROR WHILE PARSING MAKE YEARS."
          }
          ad.makeYear = Number($(info).text().split('Date: ')[1]);
        }
      }

      if(!$(element).find('span.s-item__price').text()){
        throw "ERROR WHILE PARSING PRICE."
      }

      ad.price = Number($(element).find('span.s-item__price').text().split('.')[0].replace(',', '').replace('£', ''));
      ad.url = $(element).find('a.s-item__link').attr('href');

      if(!ad.url || !ad.url.split('?hash=')[1]){
        return false;
        throw "ERROR WHILE PARSING providerAdId."
      }

      ad.providerAdId = ad.url.split('?hash=')[1].split(':')[0];
      ad.img = $(element).find('.s-item__image-wrapper img.s-item__image-img').attr('data-src');

      if(!ad.img){
        ad.img = $(element).find('.s-item__image-wrapper img.s-item__image-img').attr('src');
      }

      return ad;
    }

    function findAd(ad) {
      return new Promise(function (resolve) {
        Ad.findOne({filter: ad.filter, providerAdId: ad.providerAdId}, function (err, ad) {
          resolve(ad);
        })
      });
    }

    function extractMakeYears(ad) {
      return new Promise(function (resolve, reject) {

        if(!ad || !ad.url){
          reject(ad);
        }

        asyncRequest(ad.url).then(function (body) {
          $ = cheerio.load(body);
          let next = false;
          let years = null;
          for (let el of toArray($('div.itemAttr table td'))) {

            if (next) {
              years = Number($(el).text());
              break;
            }

            if ($(el).text().indexOf('Year') > -1) {
              next = true;
            }
          }
          resolve(years);
        }).catch(err=>{
          console.log(err.stack);
          console.log(err);
          reject(err);
        });
      });
    }

    function makeYearFilter(ad) {
      return (filter.yearFrom <= ad.year && filter.yearTo >= ad.year);
    }

    let filterAds = [];

    async function processAd(ad) {
      let oldAd = await findAd(ad);

      if (oldAd == null) {
        if (!ad.makeYear) {
          ad.year = await extractMakeYears(ad);
        }
        if (makeYearFilter(ad)) {
          console.log(`Ebay: FOUND NEW ADD -> ${ad.url}`.yellow);
          filterAds.push(ad);
        }
      }
      return ad;
    }

    return new Promise(function (resolve, reject) {

      asyncRequest(url).then(function (body) {

        $ = cheerio.load(body);
        let promises = [];

        $('ul.b-list__items_nofooter > li.s-item').each(function (i, elem) {
          promises.push(processAd(extract(elem)));
        });

        Promise.all(promises).then(function () {
          resolve(filterAds);
        }).catch(err=>{
          console.log(err.stack);
          console.log(err);
          reject(false);
        });

      }).catch(err=>{
        console.log(err.stack);
        console.log(err);
        reject(err);
      })


    });

  } catch (err){
    console.log(err.stack);
    console.log(err);
  }

  // start point, load html


}
