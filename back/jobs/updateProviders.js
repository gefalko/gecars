const providers = require('../data_control/data/providers');
const ser = require('../services/data.service');

async function init(){

    for(const provider of providers){
        try{
            console.log("Update "+provider.name+" to", provider);
            const uProvider = await ser.updateProvider(provider.name,provider);
            console.log("Updated provider",uProvider);
        }catch (err){
            console.log(err.message);
        }

    }
}

init();
