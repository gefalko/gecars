const autotraderParser = require('../../../providers/autotrader/autotraderParser');
const autotraderUrlSer = require('../../../providers/autotrader/autotraderUrlSer');
const requireText = require('require-text');
const bmw530Html = requireText('./fixtures/bmw530.html', require);
const bmw530AdHtml = requireText('./fixtures/bmw530adElement.html', require);
const cheerio = require('cheerio');
const factory = require('./factory')

const bmwFirstAd = {
    providerAdId : '201704204620847',
    url : 'http://www.autotrader.co.uk/classified/advert/201704204620847?year-to=2017&onesearchad=New&onesearchad=Nearly%20New&onesearchad=Used&radius=1501&year-from=1990&model=5%20SERIES&sort=sponsored&advertising-location=at_cars&price-from=1000&price-to=2000&postcode=dn91jf&make=BMW&page=1',
    img : 'http://i.atcdn.co.uk/imgser-uk/servlet/media?id=0096dec3ae724eeea22ff745264eeea9&width=267&height=200&paddingColour=dfdfdf',
    title : 'BMW 5 SERIES 2.5 525tds SE 4dr',
    price : 1000,
    year : 1998,
    fuel : 'Diesel'
};

describe('Url setting suite', ()=>{

    it('Should throw exception if filter is not defines', ()=>{
        expect(()=>{autotraderUrlSer.getFilterUrl()}).toThrow(new Error("Filter is not defined"));
    });

    it('Should return expection if make is not defined', ()=>{
        expect(()=>{autotraderUrlSer.getFilterUrl({})}).toThrow(new Error("Incorrect filter object"));
    });

    it('Should return expextion if make is defined but modelType not defined', ()=>{
        const filter = {
            make :{ make: 'BMW' }
        };
        expect(()=>{autotraderUrlSer.getFilterUrl(filter)}).toThrow(new Error("Incorrect filter object"));
    });
    
    it('Should return url with make bmw  and modelType X5', ()=>{
        const filter = {
            make :{ make: 'BMW' },
            modelType : { name: 'X5' }
        };
        expect(autotraderUrlSer.getFilterUrl(filter)).toBe('http://www.autotrader.co.uk/car-search?postcode=dn91jf&make=BMW&model=X5');
    });

    it('Should return url with make honda and modelType accord. In url make and modelType chars should be upper cases', ()=>{
        const filter = {
            make : { make: 'Honda' },
            modelType : { name: 'Accord' }
        };
        expect(autotraderUrlSer.getFilterUrl(filter)).toBe('http://www.autotrader.co.uk/car-search?postcode=dn91jf&make=HONDA&model=ACCORD');
    });
    
    it('Should return url with make, modelType and fuelType', ()=>{
        const filter = {
            make : { make: 'BMW' },
            modelType : { name: 'X5' },
            fuel : 'petrol'
        };
        expect(autotraderUrlSer.getFilterUrl(filter)).toBe('http://www.autotrader.co.uk/car-search?postcode=dn91jf&make=BMW&model=X5&fuel-type=Petrol');
    });

    it('Should return url with make, modelType, fuelType and yearFrom', ()=>{
        const filter = {
            make : { make: 'BMW' },
            modelType : { name: 'X5' },
            fuel : 'petrol',
            yearFrom : 2003
        };
        expect(autotraderUrlSer.getFilterUrl(filter)).toBe('http://www.autotrader.co.uk/car-search?postcode=dn91jf&make=BMW&model=X5&fuel-type=Petrol&year-from=2003');
    });
    
    it('Should return url with make, modelType, fuelType, yearTo', ()=>{
        const filter = {
            make : { make: 'BMW' },
            modelType : { name: 'X5' },
            fuel : 'petrol',
            yearTo : 2003
        };
        expect(autotraderUrlSer.getFilterUrl(filter)).toBe('http://www.autotrader.co.uk/car-search?postcode=dn91jf&make=BMW&model=X5&fuel-type=Petrol&year-to=2003');
    });
    
    it('Should return url with make, modelType and priceFrom', ()=>{
        const filter = {
            make : { make: 'BMW' },
            modelType : { name: 'X5' },
            fuel : 'petrol',
            priceFrom : 500
        };
        expect(autotraderUrlSer.getFilterUrl(filter)).toBe('http://www.autotrader.co.uk/car-search?postcode=dn91jf&make=BMW&model=X5&fuel-type=Petrol&price-from=500');
    });
    
    it('Should return url with make, modelType and priceTo', ()=>{
        const filter = {
            make : { make: 'BMW' },
            modelType : { name: 'X5' },
            fuel : 'petrol',
            priceTo : 500
        };
        expect(autotraderUrlSer.getFilterUrl(filter)).toBe('http://www.autotrader.co.uk/car-search?postcode=dn91jf&make=BMW&model=X5&fuel-type=Petrol&price-to=500');
    });

    it('Should return url with make and modelType maked from providersData', ()=>{
        const filter = {
            make : { make: 'BMW' },
            modelType : { 
                name: 'X5',
                providersData: {
                    autotrader : '5%20SERIES'
                }
            },
        };
        expect(autotraderUrlSer.getFilterUrl(filter)).toBe('http://www.autotrader.co.uk/car-search?postcode=dn91jf&make=BMW&model=5%20SERIES');
    });

    it('Should return correct url for bmw 530', ()=>{
        const url = 'http://www.autotrader.co.uk/car-search?postcode=dn91jf&make=BMW&model=5 SERIES&fuel-type=Petrol&year-from=2003&year-to=2010&price-from=100&price-to=3000';
        expect(autotraderUrlSer.getFilterUrl(factory.bmw530filter)).toBe(url);
    });

});

describe('Preparing urls for pages suite', ()=>{

    it('Should throw Error if url is not defined while preparing urls list', ()=>{
        expect(()=>{autotraderUrlSer.getPageUrls()}).toThrow(new Error('Url is not defined'));
    });

    it('Should throw Error if totalPages is not defined while preparing urls list', ()=>{
        expect(()=>{autotraderUrlSer.getPageUrls('url')}).toThrow(new Error('TotalPages is not defined'));
    });

    const urls = autotraderUrlSer.getPageUrls('test', 2);
    
    it('Should return array with links of some size as total pages', ()=>{
        expect(urls.length).toBe(2);
    });

    it('Should return corrected prepared urls', ()=>{
        expect(urls[0]).toBe('test&page=1');
        expect(urls[1]).toBe('test&page=2');
    });
});


describe('Main public method for ads parsing Suite', ()=>{

    it('Should throw exception if html not defined', ()=>{
        expect(()=>{autotraderParser.parseAds()}).toThrow(new Error('Html is not defined'));
    });

    //html copied at 2017 05 22 by url view-source:http://www.autotrader.co.uk/car-search?postcode=dn91jf&make=BMW&model=5%20SERIES&year-from=1990&year-to=2017&price-from=1000&price-to=2000 
   
    it('Should throw exception if no body tags in document', ()=>{
        expect(()=>autotraderParser.parseAds('not correct')).toThrow(new Error('Not correct html structure'));
    });
    
    it('Should return parsed ads from html', ()=>{
        const ads = autotraderParser.parseAds(bmw530Html);

        expect(Array.isArray(ads)).toBe(true);
        expect(ads.length).toBe(10);
        expect(ads[0]).toEqual(bmwFirstAd);
    });

});

describe('Testing html parsing', ()=>{
    
    it('Should throw exception if no found #main-content element', ()=>{
        const $ = cheerio.load('<body><div></div></body>');
        expect(()=>autotraderParser.checkHtmlStructureAndReturnBody($)).toThrow(new Error('Not found #main-content element'));
    });
    

    it('Should not throw exception for correct input', ()=>{
        const $ = cheerio.load(bmw530Html);
        const bodyElement = autotraderParser.checkHtmlStructureAndReturnBody($);
        expect(typeof bodyElement == 'object').toBe(true); 
    });

});

describe('Testing data parsing from ad element', ()=>{
    
    /* testing fuel and year parser */

    it('Should throw exception if not found ul.listing-key-specs element for years and fuel data.', ()=>{
        const $ = cheerio.load('<div></div>');
        
        expect(()=>{autotraderParser.parseYearsAndFuelType($('div'))})
            .toThrow(new Error('Not found ul.listing-key-specs element for extract years and fuels info'));
    }); 

    it('Should return years', ()=>{
        const html = `
        <li>
            <ul class="listing-key-specs">
                <li>2017</li>
            </ul>
        </li>
        `
        const $ = cheerio.load(html);

        expect(autotraderParser.parseYearsAndFuelType($('li')).year).toBe(2017);
    });

    it('Should return years and fuel', ()=>{
        const html = `
        <li>
            <ul class="listing-key-specs">
                <li>2016</li>
                <li>petrol</li>
            </ul>
        </li>
        `
        const $ = cheerio.load(html);
        
        const res = autotraderParser.parseYearsAndFuelType($('li'));

        expect(res.fuel).toBe('petrol');
        expect(res.year).toBe(2016);
    });

    
    it('Should return years and fuel with more li elments', ()=>{
        const html = `
        <li>
            <ul class="listing-key-specs">
                <li>2016</li>
                <li></li>
                <li>petrol</li>
            </ul>
        </li>
        `
        const $ = cheerio.load(html);
        
        const res = autotraderParser.parseYearsAndFuelType($('li'));

        expect(res.fuel).toBe('petrol');
        expect(res.year).toBe(2016);
    });
    
    it('Should return years and fuel with more li elments and if first element is not years', ()=>{
        const html = `
        <li>
            <ul class="listing-key-specs">
                <li><a class="writeOffCat"></a></li>
                <li>2016</li>
                <li></li>
                <li>petrol</li>
            </ul>
        </li>
        `
        const $ = cheerio.load(html);
        
        const res = autotraderParser.parseYearsAndFuelType($('li'));

        expect(res.fuel).toBe('petrol');
        expect(res.year).toBe(2016);
    });
    
    it('Should format years to int', ()=>{
        expect(autotraderParser.formatYears('2017')).toBe(2017);
    });
    
    it('Should format years to int with reg info', ()=>{
        expect(autotraderParser.formatYears('2017 (R reg)')).toBe(2017);
    });

    /* testing price parser */

    it(`Should throw exception if not found div.vehicle-price in  section.price-column element for set price.`,()=>{
        const $ = cheerio.load('<li><section class="price-column"><div></div></section></li>');
        
        expect(()=>{autotraderParser.parsePrice($('li'))})
            .toThrow(new Error('Not found div.vehicle-price in section.price-column element for set ad price.'))
    });

    it('Should return price on cents ', ()=>{
        expect(autotraderParser.formatPrice('£0.01')).toBe(0.01);
    })

    it('Should return price on hundreds punds ', ()=>{
        expect(autotraderParser.formatPrice('£100')).toBe(100);
    });

    it('Should return price on thausands punds ', ()=>{
        expect(autotraderParser.formatPrice('£1,445')).toBe(1445);
    });

    /* testing ad id parser */

    it('Should throw exception if parameter adLiElement is not defined', ()=>{
        expect(()=>{autotraderParser.parseProviderId()}).toThrow(new Error('adLiElement is not defined'));
    });

    it('Should throw exception if adLiElement not have id attribute', ()=>{
        const $ = cheerio.load('<div><li></li></di>');
        expect(()=>{autotraderParser.parseProviderId($('li'))}).toThrow(new Error('adLiElement id attr not defined'));
    });
    
    it('Should return id', ()=>{
        const $ = cheerio.load('<div><li id="555"></li></di>');
        expect(autotraderParser.parseProviderId($('li'))).toBe('555');
    });

    /* testing ad url parser*/
    
    it('Should throw exception if parameter adLiElement is not defined when try parse url.', ()=>{
        expect(()=>{autotraderParser.parseUrl()}).toThrow(new Error('adLiElement is not defined'));
    });

    it('Should throw exception if adLiElement not have a.listing-fpa-link element', ()=>{
        const $ = cheerio.load('<div><li></li></di>');
        expect(()=>{autotraderParser.parseUrl($('li'))})
            .toThrow(new Error('adLiElement not have a.listing-fpa-link element while try parse ad url'));
    });
    
    it('Should return url', ()=>{
        const $ = cheerio.load('<div><li><a class="listing-fpa-link" href="/test"></a></li></di>');
        expect(autotraderParser.parseUrl($('li'))).toBe('http://www.autotrader.co.uk/test');
    });

    /* testing ad img url parser */

    it('Should throw error when adLiElement is not defined when try parse img', ()=>{
        expect(()=>{autotraderParser.parseUrl()}).toThrow(new Error('adLiElement is not defined'));
    });

    it('Should throw exception if not find figure.listing-main-image img element for extract image.', ()=>{
        
        const $ = cheerio.load("<li></li>"); 
        
        expect(()=>{autotraderParser.parseImg($('li'))})
            .toThrow(new Error('Not found figure.listing-main-image img element for set ad img.'));
    });

    it('Should return img url', ()=>{
        const $ = cheerio.load('<li><figure class="listing-main-image"><img src="http://test.com/img.png"/></figure></li>'); 
        expect(autotraderParser.parseImg($('li'))).toBe('http://test.com/img.png');
    });

    /* testing title parser */

    it('Should throw exception if parameter adLiElement is not defined when try parse url.', ()=>{
        expect(()=>{autotraderParser.parseTitle()}).toThrow(new Error('adLiElement is not defined'));
    });

    it('Should throw exception if not find "h2.listing-title a.listing-fpa-link"  element for extract ad title.', ()=>{
        const $ = cheerio.load("<li></li>"); 
        
        expect(()=>{autotraderParser.parseTitle($('li'))})
            .toThrow(new Error('Not found "h2.listing-title a.listing-fpa-link" element for set ad title.'));
    });

    it('Should return title', ()=>{
        const $ = cheerio.load('<li><h2 class="listing-title"><a class="listing-fpa-link" href="http://test.com/test.html">add title</a></h2></li>'); 
        expect(autotraderParser.parseTitle($('li'))).toBe('add title');
    });

    /* testing ad parser */

    it('Should throw exception if parameter adLiElement is not defined when try parse ad.', ()=>{
        expect(()=>{autotraderParser.parseAd()}).toThrow(new Error('adLiElement is not defined'));
    });
    
    it('should throw exception if imput not have find method (cheerio object should have).', ()=>{
        expect(()=>{autotraderParser.parseAd('<div></div>')}).toThrow(new Error('Input is not cheerio element. Not found find method.'))
    });

    describe('ad parse suite', ()=>{

        const expectAd = {
            providerAdId : '201704204620847',
            url : 'http://www.autotrader.co.uk/classified/advert/201704204620847?year-to=2017&onesearchad=New&onesearchad=Nearly%20New&onesearchad=Used&radius=1501&year-from=1990&model=5%20SERIES&sort=sponsored&advertising-location=at_cars&price-from=1000&price-to=2000&postcode=dn91jf&make=BMW&page=1',
            img : 'http://i.atcdn.co.uk/imgser-uk/servlet/media?id=0096dec3ae724eeea22ff745264eeea9&width=267&height=200&paddingColour=dfdfdf',
            title : 'BMW 5 SERIES 2.5 525tds SE 4dr',
            price : 1000,
            year : 1998,
            fuel : 'Diesel'
        };
        
        const $ = cheerio.load(bmw530AdHtml);

        const resAd = autotraderParser.parseAd($('li')); 
        
        it('Should retun bmw ad provider ad id.', ()=>{
            expect(resAd.providerAdId).toEqual(expectAd.providerAdId);
        });
        
        it('Should retun bmw ad url.', ()=>{
            expect(resAd.url).toBe(expectAd.url);
        });
        
        it('Should retun bmw ad img url.', ()=>{
            expect(resAd.img).toBe(expectAd.img);
        });
        
        it('Should retun bmw ad title.', ()=>{
            expect(resAd.title).toBe(expectAd.title);
        });
        
        it('Should retun bmw ad price.', ()=>{
            expect(resAd.price).toBe(expectAd.price);
        });
        
        it('Should retun bmw ad year.', ()=>{
            expect(resAd.year).toBe(expectAd.year);
        });
        
        it('Should retun bmw ad fuel.', ()=>{
            expect(resAd.fuel).toBe(expectAd.fuel);
        });
        
        it('Should retun bmw ad.', ()=>{
            expect(resAd).toEqual(expectAd);
        });
    });
});

describe('Extract ads cheerio elements from main html.', ()=>{

    it('Should throw exception if no found ul.search-page__results element', ()=>{
        const $ = cheerio.load('<body><div id="main-content"></div></body>');
        expect(()=>autotraderParser.getAdsElements($('body'))).toThrow(new Error('Not found ul.search-page__results element'));
    });

    const $ = cheerio.load(bmw530Html);    

    const adsElements = autotraderParser.getAdsElements($('body'));

    const firstAdElement = adsElements.first();

    it('Should return elements length 10', ()=>{
       expect(adsElements.length).toBe(10); 
    });

    
    it('Should parse first ad correctly.', ()=>{
        expect(autotraderParser.parseAd(firstAdElement)).toEqual(bmwFirstAd);
    });

});

describe('Extract number of pages Suite.', ()=>{
    
    it('Should throw Error if html is not defined', ()=>{
        expect(()=>{autotraderParser.parsePagesNumber()}).toThrow(new Error('Html is not defined'));
    });

    it('Should throw Error if "nav.paginationMini li.paginationMini__count strong" element not found', ()=>{
        expect(()=>{autotraderParser.parsePagesNumber('<body><div id="main-content"></div></body>')})
            .toThrow(new Error('"nav.paginationMini li.paginationMini__count strong" element not found while parsing pages number'))
    });

    it('Should return number of pages', ()=>{
        expect(autotraderParser.parsePagesNumber(bmw530Html)).toBe(2);
    });
});
