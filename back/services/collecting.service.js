const autotraderCtrl = require('../providers/autotrader/autotraderCtrl');

module.exports = function(httpSer){

    const self = this;

    this.collectOrderAds = collectOrderAds;
    this.collectFilterAds = collectFilterAds;
    this.collectFilterProviderAds = collectFilterProviderAds;

    if(!httpSer){
        throw new Error('httpSer is not defined');
    }
    
    if(!httpSer.getHtml){
        throw new Error('httpSer not have getHtml method');
    }

    /* public */
    function collectOrderAds(order){
        if(!order){
            return null;
        }
    }

    /* public */
    function collectFilterAds(filter){
        if(!filter){
            return null;
        }
    }

    /* public */
    function collectFilterProviderAds(filter, provider){

        try{
            if(!filter){
                return null;
            }

            if(!provider){
                throw new Error('Provider is not defined');
            }

            switch(provider) {
                case 'gumtree':
                    return gumtree(filter);
                case 'autotrader':
                    return  autotraderCtrl.getFiltrededAds(filter, httpSer);
                case 'ebay':
                    return ebay(filter);
            }

            throw new Error('Provider '+provider+' not exist.');
        }catch(err){
            throw err;
        }

    }
    
    return self;
}

