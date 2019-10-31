const mongoose = require('mongoose');
require('./../models/db');
const dataSer = require('../services/data.service');

import {Make} from '../models/make/MakeModel';
import {ModelType} from '../models/modelType/ModelTypeModel';

const colors = require('colors');

const args: IArgs = process.argv.slice(2).reduce((res, cur) => {
  const arg = cur.split('=')
  res[arg[0]] = arg[1]
  return res
}, {});

const { debug } =  args

function findMake(make){
    return new Promise(function(resolve){
        Make.findOne({make:make},function(err, make){
            resolve(make);
        })
    })
}

function findModel(makeId, model){
    return new Promise(function(resolve){
      ModelType.findOne({name:model, make: makeId},function(err, model){
            resolve(model);
        })
    })
}

function updateModel(makeId, modelName, newModel){
    return new Promise(function(resolve){
      ModelType.findOneAndUpdate({name:modelName, make: makeId}, newModel, {upsert:true}, function(err, model){
            if(model == null){
                // create new

              ModelType.create({
                    make:makeId,
                    name:modelName,
                    providersData: newModel.providersData
                }).then(function(model){
                    resolve(model);
                })
            }
            resolve(model);
        });
    })
}

const makes = require('./../data_control/data/makeModelsData2.json');

const consolelog = (msg, obj) => {
  if(debug){
    console.log(msg)
    if(obj){
      console.log(obj)
    }
  }
}

//cionst data = require('./downloadMakeModels');

async function init() {


    for(let _make of makes){


        console.log("process make "+_make.make+" ".blue);

        let make = await findMake(_make.make);
        let saveMake = false;

        if(!make){
            consolelog("MAKE NOT EXIST ->",make);
            make = await dataSer.createMake({make:_make.make});
            consolelog("CREATED NEW MAKE - > ",make);
        }else{

            consolelog(`${make.make} ${_make.make} `.red);

            for(let _model of _make.modelTypes){

                consolelog("---------------------------------------------------------");
                consolelog(_make.modelTypes);
                consolelog("---------------------------------------------------------");

                let model = await updateModel(make._id,_model.name, _model);

                consolelog(`updated to `.blue);
                consolelog(_model);
                consolelog(`updated model `.green);
                consolelog(model);

                if(!model){
                    consolelog("PROBLEM WITH MODULE".bold.red);
                }else{
                    consolelog('TRY ADD TO MODELS TYPES LIST... model._id->', model._id);
                    consolelog("make:");
                    consolelog(make);
                    consolelog('make.modelsTypes.indexOf(model._id == -1)', make.modelTypes.indexOf(model._id == -1));

                    // if model id not exist in make.models add
                    if(make.modelTypes.indexOf(model._id == -1)){
                        consolelog("Add model to make.models");
                        make.modelTypes.push(model._id);
                        saveMake = true;
                    }
                } 

            }
        }

        if(saveMake)make.save();

        consolelog("------------------------------------------");
    }

    console.log('finish')
    process.exit()
    return true;

}

try{
  init();
}catch(err){
    console.log(err);
}




