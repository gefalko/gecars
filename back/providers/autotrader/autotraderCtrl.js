const autotraderUrlSer = require('./autotraderUrlSer');
const autotraderParser = require('./autotraderParser');
const dbSer = require('../../services/data.service');

module.exports = {
    filter2ads : filter2ads,
    getFiltrededAds : getFiltrededAds
};

async function filter2ads(filter, httpSer, logs){

    let url;

    try{

        if(!filter){
            throw new Error('Filter is not defined');
        }
       
        if(!httpSer){
            throw new Error('HttpSer is not defined');
        }

        if(!httpSer.getHtml){
            throw new Error('HttpSer not have getHtml method');
        }

        url = autotraderUrlSer.getFilterUrl(filter);

        console.log('Filter url: ', url)

        let html = await httpSer.getHtml(url);

        const totalPages = autotraderParser.parsePagesNumber(html);

        console.log('Total pages: ', totalPages)

        let ads = autotraderParser.parseAds(html);
        
        let filterAds = ads;
        
        if(!totalPages){

        }else{

            const urls = autotraderUrlSer.getPageUrls(url, totalPages);

            if(urls.length > 1){
                
                for(let i = 1; i < urls.length; i++){
                   
                    if( i > 10 ) break;

                    html = await httpSer.getHtml(urls[i]);
                    
                    ads = autotraderParser.parseAds(html);

                    filterAds = filterAds.concat(ads);
                }
            }
        }

        if(logs){
            logs("url:"+url);
        }
        
        return filterAds;

    }catch(err){
        
        if(logs){
           logs("url:"+url);
        }

        throw err;
    }
}

async function getFiltrededAds(filter, httpSer, logs){

    const ads = await filter2ads(filter, httpSer, logs); 
    
    return filterAdsNotInDB(ads);
}


async function filterAdsNotInDB(ads){
    const filtredAds  = [];
    for(let ad of ads){
        let exist = await dbSer.orAdExist(ad);
        if(!exist){
            filtredAds.push(ad);
        }
    }
    return filtredAds;
}
