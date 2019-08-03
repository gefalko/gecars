const dataSer = require('../../services/data.service');
const gumtree = require('.././gumtree');
const autotrader = require('../../providers/autotrader');
const ebay = require('../../providers/Ebay/ebay');

module.exports = {
    doTest : doTest
}


function collect(strategy, filter){
    switch(strategy) {
        case 'gumtree':
            return gumtree(filter);
        case 'autotrader':
            return autotrader(filter);
        case 'ebay':
            return ebay(filter);
    }

}

async function doTest(res, filterId, providerId){
   res.console.log("providers teste: start");

   const provider = await dataSer.getProvider(providerId);
   const filter = await dataSer.getFilterByIdFull(filterId);

   res.console.log("Provider", provider);
   res.console.log("Filter", filter);

   const ads = await collect(provider.name, filter); 
    
   res.console.log("Ads ", ads);
   return ads;
}


