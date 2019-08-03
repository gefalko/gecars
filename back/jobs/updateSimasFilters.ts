// Update simas filters
const filters = require('./../data_control/data/simasData/active');
const ser = require('../services/data.service');
const colors = require('colors');
const ObjectId = (require('mongoose').Types.ObjectId);
import { User } from '../models/user/UserModel';
import { Order } from '../models/order/OrderModel';
import { Make } from '../models/make/MakeModel';

async function formatProviders(providers){
  const ids = [];
  for(const provider of providers){
    const id = await ser.findProviderId(provider)

    if(!id){
      throw new Error(`Provider ${provider} not exist in DB. Please insert provider.`)
    }

    ids.push(new ObjectId(id));
  }
  return ids;
}

async function updateFilter(orderId, rFilter, sFilter){

    console.log("FILTER FOR UPDATE",sFilter);

    //for update providers ->
    let uFilter = await ser.updateFilter(rFilter._id,{$set:{providers:sFilter.providers, order: sFilter.order }});
    //update other data
    uFilter = await ser.updateFilter(rFilter._id,sFilter);

    console.log("UPDATED FILTER",uFilter);

    console.log(`${sFilter.make}->${sFilter.modelType}  `);

    return uFilter;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


async function init(){
    let user = await ser.findUser('ge4cars@gmail.com');

    if(!user){

      const order = new Order();
      await order.save();

      user = new User({
        email: 'ge4cars@gmail.com',
        orders: [order]
      });

      await user.save();
      user = await ser.findUser('ge4cars@gmail.com');
    }
  
    const orderId = user.orders[0];
    const order = await ser.findOrderById(orderId);
    order.filters = [];

    console.log('UPDATE FILTERS FOR ORDER :'+orderId)
    console.log(order)

    try{
        for(const filter of filters){
            console.log("Process filter:", filter);

            const makeId = await ser.findMakeId(capitalizeFirstLetter(filter.make));

            if(!makeId){
              const make = new Make({_id: makeId, make: capitalizeFirstLetter(filter.make)})
              await make.save();
              throw new Error("Make not exist: "+filter.make);
            }

            const modelId = await ser.findModelId(makeId, capitalizeFirstLetter(filter.modelType));

            if(!modelId)throw new Error("modelId not exist: "+filter.modelType);

            const sFilter = {
                make:new ObjectId(makeId),
                modelType:new ObjectId(modelId),
                yearFrom:filter.yearFrom,
                yearTo:filter.yearTo,
                priceFrom:filter.priceFrom,
                priceTo:filter.priceTo,
            }

            if(filter.fuel){
                sFilter.fuel = filter.fuel;
            }
            const rFilters = await ser.findFilters(sFilter);

            sFilter.order = new ObjectId(orderId);
            sFilter.providers = await formatProviders(filter.providers);

            console.log('Prepared filter to db:')
            console.log(sFilter)
            console.log("EXISTING DB FILTERS:",rFilters);

            if(rFilters.length > 1)throw new Error("To many filters");

            if(rFilters.length == 0 && !filter.remove){
                console.log("Creating new filter:",sFilter);
                const nFilter = await ser.createFilter(sFilter);
                order.filters.push(nFilter._id);
                console.log("Created new filter:",nFilter);
                console.log("Created!".green.bold);
            }else{

                const rFilter = rFilters[0];

                if(filter.remove){
                    if(rFilter)await ser.removeFilter(rFilter._id);
                    console.log("Removed!".green.bold);
                }else{
                    const uFilter = await updateFilter(orderId, rFilter, sFilter, filter);
                    order.filters.push(uFilter._id);
                    console.log("Updated!".green.bold);
                }
              }


            console.log(" --------------------------------------- ".red);
        }
 
        Order.update({_id: order.id}, order, function(err, raw) {
          if (err) {
            throw err;
          }
          console.log("UPDATE ORDER!".bold.green, order );
          process.exit()
        });

    }catch (err){
        console.log(err.message);
        console.log(err.stack)
    }

}


init();

