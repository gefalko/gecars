"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
require('./../models/db');
const dataSer = require('../services/data.service');
const MakeModel_1 = require("../models/make/MakeModel");
const ModelTypeModel_1 = require("../models/modelType/ModelTypeModel");
const colors = require('colors');
const args = process.argv.slice(2).reduce((res, cur) => {
    const arg = cur.split('=');
    res[arg[0]] = arg[1];
    return res;
}, {});
const { debug } = args;
function findMake(make) {
    return new Promise(function (resolve) {
        MakeModel_1.Make.findOne({ make: make }, function (err, make) {
            resolve(make);
        });
    });
}
function findModel(makeId, model) {
    return new Promise(function (resolve) {
        ModelTypeModel_1.ModelType.findOne({ name: model, make: makeId }, function (err, model) {
            resolve(model);
        });
    });
}
function updateModel(makeId, modelName, newModel) {
    return new Promise(function (resolve) {
        ModelTypeModel_1.ModelType.findOneAndUpdate({ name: modelName, make: makeId }, newModel, { upsert: true }, function (err, model) {
            if (model == null) {
                // create new
                ModelTypeModel_1.ModelType.create({
                    make: makeId,
                    name: modelName,
                    providersData: newModel.providersData
                }).then(function (model) {
                    resolve(model);
                });
            }
            resolve(model);
        });
    });
}
const makes = require('./../data_control/data/makeModelsData2.json');
const consolelog = (msg, obj) => {
    if (debug) {
        console.log(msg);
        if (obj) {
            console.log(obj);
        }
    }
};
//cionst data = require('./downloadMakeModels');
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let _make of makes) {
            console.log("process make " + _make.make + " ".blue);
            let make = yield findMake(_make.make);
            let saveMake = false;
            if (!make) {
                consolelog("MAKE NOT EXIST ->", make);
                make = yield dataSer.createMake({ make: _make.make });
                consolelog("CREATED NEW MAKE - > ", make);
            }
            else {
                consolelog(`${make.make} ${_make.make} `.red);
                for (let _model of _make.modelTypes) {
                    consolelog("---------------------------------------------------------");
                    consolelog(_make.modelTypes);
                    consolelog("---------------------------------------------------------");
                    let model = yield updateModel(make._id, _model.name, _model);
                    consolelog(`updated to `.blue);
                    consolelog(_model);
                    consolelog(`updated model `.green);
                    consolelog(model);
                    if (!model) {
                        consolelog("PROBLEM WITH MODULE".bold.red);
                    }
                    else {
                        consolelog('TRY ADD TO MODELS TYPES LIST... model._id->', model._id);
                        consolelog("make:");
                        consolelog(make);
                        consolelog('make.modelsTypes.indexOf(model._id == -1)', make.modelTypes.indexOf(model._id == -1));
                        // if model id not exist in make.models add
                        if (make.modelTypes.indexOf(model._id == -1)) {
                            consolelog("Add model to make.models");
                            make.modelTypes.push(model._id);
                            saveMake = true;
                        }
                    }
                }
            }
            if (saveMake)
                make.save();
            consolelog("------------------------------------------");
        }
        console.log('finish');
        process.exit();
        return true;
    });
}
try {
    init();
}
catch (err) {
    console.log(err);
}
