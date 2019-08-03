const autotraderCtrl = require('../../../providers/autotrader/autotraderCtrl');
const requireText = require('require-text');
const bmw530Html = requireText('./bmw530.html', require);

const bmwFirstAd = {
    providerAdId : '201704204620847',
    url : 'http://www.autotrader.co.uk/classified/advert/201704204620847?year-to=2017&onesearchad=New&onesearchad=Nearly%20New&onesearchad=Used&radius=1501&year-from=1990&model=5%20SERIES&sort=sponsored&advertising-location=at_cars&price-from=1000&price-to=2000&postcode=dn91jf&make=BMW&page=1',
    img : 'http://i.atcdn.co.uk/imgser-uk/servlet/media?id=0096dec3ae724eeea22ff745264eeea9&width=267&height=200&paddingColour=dfdfdf',
    title : 'BMW 5 SERIES 2.5 525tds SE 4dr',
    price : 1000,
    year : 1998,
    fuel : 'Diesel'
};

describe('Extracting ads by filter', ()=>{

    it('Should throw Error if filter is not defined', (done)=>{
        autotraderCtrl.filter2ads().then().catch(err => {
            expect(err).toEqual(new Error('Filter is not defined'));
            done(err);
        });
    });

    it('Should throw Error if httpSer is not defined', ()=>{
        autotraderCtrl.filter2ads({}).then().catch(err => {
            expect(err).toEqual(new Error('HttpSer is not defined'));
            done(err);
        });
    });

    it('Should throw Error if httpSer not have getHtml method', ()=>{
        autotraderCtrl.filter2ads({}, {}).then().catch(err => {
            expect(err).toEqual(new Error('HttpSer not have getHtml method'));
            done(err);
        });
    });
    
    const promise = new Promise((resolve)=>{
        resolve(bmw530Html);
    });

    const httpSer = {
        getHtml : (url)=>{
            return promise;
        }
    };

    const filter = {
        make : { make: 'BMW' },
        model: { name: '530'}
    };

    it('Should return 20 ads from html of 2 pages and first ad should be as expect', (done)=>{
        autotraderCtrl.filter2ads(filter, httpSer).then((ads) => {
            expect(ads.length).toBe(20);
            expect(ads[0]).toEqual(bmwFirstAd);
            done(ads);
        }).catch(err=>{
            console.log(err);
            done(err);
        });
    });
});

describe('get filtred ads suite', ()=>{
    it('Should throw error if filter is not define', (done)=>{
        const p = autotraderCtrl.getFiltrededAds(); 
        
        p.then(()=>{
            expect(true).toBe(false);
            done();
        }).catch(err => {
            expect(err).toEqual(new Error('Filter is not defined'));
            done(err);
        });
    });
});

