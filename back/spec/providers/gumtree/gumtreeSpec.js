"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var gumtree_1 = require('../../../providers/gumtree/gumtree');
var FilterModel_1 = require("../../../models/filter/FilterModel");
var MakeModel_1 = require("../../../models/make/MakeModel");
var ModelTypeModel_1 = require("../../../models/modelType/ModelTypeModel");
var requireText = require('require-text');
var toyotaHtml = requireText("./fixtures/toyota/landcruiser/pf_0_pt4000_yf99_yt02.html", require);
var mongoose = require('mongoose');
var make = new MakeModel_1.Make({
    make: 'BMW'
});
var modelType = new ModelTypeModel_1.ModelType({
    name: '320'
});
var filterObj = {
    yearFrom: 1999,
    yearTo: 2020,
    priceFrom: 1500,
    priceTo: 5000,
    fuel: 'Petrol',
    make: make,
    modelType: modelType
};
var request = {
    getHtml: function () {
        return new Promise(function (resolve) {
            resolve(toyotaHtml);
        });
    }
};
describe('gumtree', function () {
    beforeAll(function (done) {
        var options = { promiseLibrary: require('bluebird') };
        mongoose.Promise = require('bluebird');
        mongoose.connect('mongodb://localhost/gecarTestDatabase', options);
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function () {
            done();
        });
        db.once('close', function () {
            console.log('close');
        });
    });
    afterAll(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            console.log('after all close');
            mongoose.connection.close(done);
        });
    });
    it('It should work with async/await.', function () __awaiter(this, void 0, void 0, function* () {
        var collector = new gumtree_1.Gumtree(request);
        var ads = yield collector.getNewAds(new FilterModel_1.Filter(filterObj));
        expect(ads.length > 0).toBeTruthy();
    }));
    it('Should return correct url when filter is passed.', function (done) {
        try {
            console.log(1);
            console.log(2);
            var collector = new gumtree_1.Gumtree(request);
            console.log(3);
            var filter = new FilterModel_1.Filter(filterObj);
            console.log(4);
            collector.test().then(function (res) {
                console.log(res);
                done();
            });
            console.log();
            var expectedUrl = "https://www.gumtree.com/search?search_category=cars&search_location=uk&vehicle_make=\n                    BMW&vehicle_model=320&q=&min_price=\n                    1500&max_price=2000&vehicle_fuel_type=petrol";
        }
        catch (err) {
            expect(err).toBeNull();
        }
    });
});
