import {Gumtree} from '../../../providers/gumtree/gumtree'
import {Filter} from "../../../models/filter/FilterModel";
import {Make} from "../../../models/make/MakeModel";
import {FilterInterface} from "../../../models/filter/FilterInterface";
import {Provider} from '../../../models/provider/ProviderModel'
import {ModelTypeModelI, ModelType} from "../../../models/modelType/ModelTypeModel";
import {requestHtmlInterface} from "../../../providers/requestHtmlInterface";
import {AdInterface} from "../../../models/ad/AdInterface";

import {AdModelI, Ad} from "../../../models/ad/AdModel";

const requireText = require('require-text');
const toyotaHtml = requireText("./fixtures/toyota/landcruiser/pf_0_pt4000_yf99_yt02.html", require);

const mongoose = require('mongoose');


const make = new Make({
    make: 'BMW'
});

const modelType = new ModelType({
    name: '320'
});

const filterObj: FilterInterface = {
    yearFrom: 1999,
    yearTo: 2020,
    priceFrom: 1500,
    priceTo: 5000,
    fuel: 'Petrol',
    make: make,
    modelType: modelType
};

const request: requestHtmlInterface = {
    getHtml: () => {
        return new Promise((resolve) => {
            resolve(toyotaHtml)
        })
    }
};

describe('gumtree', () => {

    beforeAll(function (done) {

        const options = {promiseLibrary: require('bluebird')};
        mongoose.Promise = require('bluebird');

        mongoose.connect('mongodb://localhost/gecarTestDatabase', options);
        const db = mongoose.connection;

        db.on('error', console.error.bind(console, 'connection error'));

        db.once('open', function () {
            done();
        });

        db.once('close', function () {
            console.log('close')
        });
    });

    afterAll(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            console.log('after all close')
            mongoose.connection.close(done);
        });
    });

    it('It should work with async/await.', async() => {
        const collector = new Gumtree(request);
        const ads = await collector.getNewAds(new Filter(filterObj));
        expect(ads.length > 0).toBeTruthy();
    });

    it('Should return correct url when filter is passed.', (done) => {
        try {

            console.log(1);


            console.log(2);

            const collector = new Gumtree(request);

            console.log(3);

            const filter = new Filter(filterObj);

            console.log(4);

            collector.test().then((res) => {
                console.log(res);
                done();
            });

            console.log();


            const expectedUrl: string =
                `https://www.gumtree.com/search?search_category=cars&search_location=uk&vehicle_make=
                    BMW&vehicle_model=320&q=&min_price=
                    1500&max_price=2000&vehicle_fuel_type=petrol`;

            //expect(await collector.test()).toBe("OKS");
            //expect(Gumtree.getUrl(filterObj)).toBe(expectedUrl);
        } catch (err) {
            expect(err).toBeNull();
        }

    })
});

