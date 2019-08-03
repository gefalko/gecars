const collectSer = require('../../services/collecting.service');

const httpSer = {
    getHtml : {}
}

describe('Dependencies setup suite', ()=>{
    it('Should throw error if httpSer is not defineid', ()=>{
        expect(()=>{collectSer();}).toThrow(new Error('httpSer is not defined'));
    });
    
    it('Should throw error if httpSer not have getHtml method', ()=>{
        expect(()=>{collectSer({});}).toThrow(new Error('httpSer not have getHtml method'));
    });
});

describe('Order ads collecting suite',()=>{
    it('Should retutn null if order is undefined', ()=>{
        const ads = collectSer(httpSer).collectOrderAds();
        expect(ads).toBe(null);
    });
});

describe('Filter ads collecting suite', ()=>{
    it('Should retutn null if filter is undefined', ()=>{
        const ads = collectSer(httpSer).collectFilterAds();
        expect(ads).toBe(null);
    });
});

describe('Filter provider ads collecting suite', ()=>{

    /* copy from db */
    const filter = { 
        _id: '8babbf60730a331de997c27',
        make: 
            { 
                _id: '58b6c00ac2228c4a9bca7a7f',
                make: 'bmw',
                __v: 1,
                models: 
                    [ '58b6c00ac2228c4a9bca7a8f',
                   '58b6c00ac2228c4a9bca7a90',
                   '58b6c00ac2228c4a9bca7a91' ] },
        model: 
            { 
            _id: '58b6c00ac2228c4a9bca7a8f',
            make:'58b6c00ac2228c4a9bca7a7f',
            name: 'X5',
            __v: 0 },
        yearFrom: 1990,
        yearTo: 2008,
        priceFrom: 0,
        priceTo: 3500,
        order: '58b6c00ac2228c4a9bca7ac0',
        __v: 0,
        status: 0,
        providers: 
    ['58b6c00ac2228c4a9bca7a7d',
         '58b92c40020c96272873d378',
         '58b92c40020c96272873d377' ]
    };

    it('Should return null if filter is undefined', ()=>{
        const ads = collectSer(httpSer).collectFilterProviderAds();
        expect(ads).toBe(null);
    });
    
    it('Should throw error if provider is undefined showld throw exception', ()=>{ 
        expect(()=>{collectSer(httpSer).collectFilterProviderAds({});}).toThrow(new Error("Provider is not defined"));
    });


    it('Should throw err if provider not exist showld throw exception', ()=>{ 
        expect(()=>{collectSer(httpSer).collectFilterProviderAds({},'notExist');})
            .toThrow(new Error("Provider notExist not exist."));
    });

    it('Should throw err if provider "notExist2" not exist showld throw exception', ()=>{ 
        expect(()=>{collectSer(httpSer).collectFilterProviderAds({},'notExist2');})
            .toThrow(new Error("Provider notExist2 not exist."));
    });
    
    it('Should return autotrader bmw x5 ads',(done)=>{
        collectSer(httpSer).collectFilterProviderAds(filter, 'autotrader').then(ads =>{
            expect(ads.length).toBe(20);
            done();
        }).catch(err=>{
            expect(true).toBe(false);
        });
        
    });
    
});
