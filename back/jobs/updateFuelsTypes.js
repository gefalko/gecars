const fuelsTypes = require('../data_control/data/fuelsTypes');
const ser = require('../services/data.service');

async function init(){

    for(const type of fuelsTypes){
        try{
            console.log("Update "+type.name+" to", type);
            const uType = await ser.updateFuelType(type.name, type);
            console.log("Updated provider",uType);
        }catch (err){
            console.log(err.message);
        }

    }
}

init();
