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
const cheerio = require("cheerio");
const AdModel_1 = require("../../models/ad/AdModel");
const colors = require('colors');
class Gumtree {
    constructor(requestHtml, debug) {
        this.debug = false;
        this.$ = null;
        this.requestHtml = requestHtml;
        this.debug = debug;
    }
    debugModeOn() {
        this.debug = true;
        return this;
    }
    consolelog(msg, obj) {
        if (true) {
            console.log(msg);
            if (obj) {
                console.log(obj);
            }
        }
    }
    // @TODO move out to service
    static priceFilter(ad, filter) {
        console.log('ad.price >= filter.priceFrom && ad.price <= filter.priceTo', `${ad.price} >= ${filter.priceFrom} && ${ad.price} <= ${filter.priceTo}`);
        return (ad.price >= filter.priceFrom && ad.price <= filter.priceTo);
    }
    // @TODO move out to service
    static yearsFilter(ad, filter) {
        console.log('ad.year >= filter.yearFrom && ad.year <= filter.yearTo', `${ad.year} >= ${filter.yearFrom} && ${ad.year} <= ${filter.yearTo}`);
        return (ad.year >= filter.yearFrom && ad.year <= filter.yearTo);
    }
    // @TODO move out to service
    static doFilter(ad, filter) {
        const passPriceFilter = Gumtree.priceFilter(ad, filter);
        const passYearsFilter = Gumtree.yearsFilter(ad, filter);
        console.log('PASS price filter:', passPriceFilter);
        console.log('PASS years filter:', passYearsFilter);
        return (passPriceFilter && passYearsFilter);
    }
    getNewAds(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            this.consolelog('filter', filter);
            // check or gumtree has this kind model
            if (filter.modelType.providersData.gumtree === null) {
                return [];
            }
            const url = Gumtree.getUrl(filter);
            if (this.debug) {
                console.log("URL FOR FILTER: ");
                console.log(url);
            }
            const html = yield this.requestHtml.getHtml(url);
            console.log('-------------------------HTML-----------------------------');
            console.log(html);
            console.log('-------------------------HTML-----------------------------');
            this.$ = cheerio.load(html);
            return yield this.checkAds(filter);
        });
    }
    checkAds(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const consolelog = this.consolelog;
            this.consolelog('Start checkAds.');
            const urlAds = this.getUrlAds(filter);
            this.consolelog('Print formated but not filtered ads from html:', urlAds);
            const filtredAds = [];
            for (let ad of urlAds) {
                if (yield checkAd(ad)) {
                    filtredAds.push(ad);
                }
            }
            const self = this;
            function checkAd(ad) {
                return __awaiter(this, void 0, void 0, function* () {
                    consolelog('Check or specifc add pass filter requarements:', ad);
                    try {
                        const dbAd = yield AdModel_1.Ad.findOne({ filter: ad.filter, providerAdId: ad.providerAdId }).exec();
                        if (dbAd == null) {
                            if (Gumtree.doFilter(ad, filter)) {
                                //ads.push(ad); @TODO change true to this.debug
                                if (true) {
                                    console.log(('Gumtree:').yellow.bold + ` FOUND NEW ADD -> ${ad.url}`.yellow);
                                }
                                return true;
                            }
                        }
                    }
                    catch (err) {
                        console.log(err);
                    }
                    return false;
                });
            }
            return filtredAds;
        });
    }
    getUrlAds(filter) {
        const extractElementAd = (i, elem) => {
            return this.extract(elem, filter);
        };
        const featuredAds = this.$('ul[data-q="featuredresults"] > li').map(extractElementAd).get();
        console.log('number of featuredAds:', featuredAds.length);
        const naturalAds = this.$('ul[data-q="naturalresults"] > li.natural').map(extractElementAd).get();
        console.log('number of naturalAds:', naturalAds.length);
        return [].concat(featuredAds, naturalAds);
    }
    static parsePrice(element) {
        return element.text().replace('£', '').replace(',', '');
    }
    extract(element, filter) {
        return {
            filter: filter._id,
            make: filter.make._id,
            modelType: filter.modelType._id,
            fuel: this.$(element).find('[itemprop="fuelType"]').text(),
            year: Number(this.$(element).find('[itemprop="dateVehicleFirstRegistered"]').text()),
            price: Number(Gumtree.parsePrice(this.$(element).find('.listing-price'))),
            providerAdId: this.$(element).find('[data-q]').attr('data-q'),
            url: 'https://www.gumtree.com' + this.$(element).find('[itemprop="url"]').attr('href'),
            img: this.$(element).find('noscript img').attr('src')
        };
    }
    static getUrl(filter) {
        const data = filter.modelType.providersData.gumtree;
        let modelType = '';
        let q = '';
        if (!data) {
            modelType = filter.modelType.name;
        }
        else if (!data.q) {
            modelType = filter.modelType.providersData.gumtree;
        }
        else {
            q = data.q;
        }
        const modelTypeName = modelType.toLowerCase().split(' ').join('-');
        const { priceFrom, priceTo, make } = filter;
        const host = 'https://www.gumtree.com/cars/uk/';
        return `${host}${make.make.toLowerCase()}/${modelTypeName}?max_price=${priceTo}&min_price=${priceFrom}`;
        return `https://www.gumtree.com/search?search_category=cars&search_location=uk&vehicle_make=${filter.make.make.toLowerCase()}&vehicle_model=${modelType.toLowerCase()}&q=${q}&min_price=${filter.priceFrom}&max_price=${filter.priceTo}${Gumtree.getFuelForUrl(filter)}`;
    }
    static getFuelForUrl(filter) {
        return (filter.fuel ? "&vehicle_fuel_type=" + filter.fuel : '');
    }
}
exports.Gumtree = Gumtree;
