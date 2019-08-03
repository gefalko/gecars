"use strict";
exports.__esModule = true;
require('./../models/db');
var ProviderModel_1 = require("./../models/provider/ProviderModel");
var MakeModel_1 = require("./../models/make/MakeModel");
var ModelTypeModel_1 = require("./../models/modelType/ModelTypeModel");
var OrderModel_1 = require("./../models/order/OrderModel");
var FuelTypeModel_1 = require("./../models/fuelType/FuelTypeModel");
var TransactionModel_1 = require("./../models/transaction/TransactionModel");
var AdModel_1 = require("./../models/ad/AdModel");
var UserModel_1 = require("./../models/user/UserModel");
var FilterModel_1 = require("./../models/filter/FilterModel");
module.exports = {
    findMake: findMake,
    findMakeId: findMakeId,
    findModelId: findModelId,
    findModel: findModel,
    findUser: findUser,
    getUsers: getUsers,
    findFilters: findFilters,
    updateFilter: updateFilter,
    getFilterById: getFilterById,
    getFilterByIdFull: getFilterByIdFull,
    removeFilter: removeFilter,
    createFilter: createFilter,
    loadAllMakesFull: loadAllMakesFull,
    findOrderById: findOrderById,
    findProviderId: findProviderId,
    getProviders: getProviders,
    getProvider: getProvider,
    getFuelTypes: getFuelTypes,
    updateProvider: updateProvider,
    updateFuelType: updateFuelType,
    createOrder: createOrder,
    createTransaction: createTransaction,
    createMake: createMake,
    findUserOrders: findUserOrders,
    findModelsByName: findModelsByName,
    saveUser: saveUser,
    /* Ads */
    orAdExist: orAdExist
};
function saveUser(email, pass) {
    console.log("SAVE NEW USER", email);
    var user = new UserModel_1.User();
    user.email = email;
    user.setPassword(pass);
    return new Promise(function (resolve) {
        user.save(function (err) {
            var token = user.generateJwt();
            resolve(token);
        });
    });
}
function findUser(email) {
    return new Promise(function (resolve) {
        UserModel_1.User.findOne({ email: email }, function (err, user) {
            if (err)
                throw err;
            resolve(user);
        });
    });
}
function getUsers() {
    return new Promise(function (resolve) {
        UserModel_1.User.find({}, function (err, users) {
            if (err)
                throw err;
            resolve(users);
        });
    });
}
function findMake(make) {
    return new Promise(function (resolve) {
        MakeModel_1.Make.findOne({ make: make }, function (err, make) {
            if (err)
                throw err;
            resolve(make);
        });
    });
}
function findMakeId(make) {
    return new Promise(function (resolve) {
        findMake(make).then(function (make) {
            if (!make)
                resolve(make);
            resolve(make._id);
        });
    });
}
function findModelsByName(modelName) {
    return new Promise(function (resolve) {
        ModelTypeModel_1.ModelType.find({ name: modelType }, function (err, models) {
            if (err)
                throw err;
            else
                resolve(models);
        });
    });
}
function findModel(makeId, modelType) {
    return new Promise(function (resolve) {
        ModelTypeModel_1.ModelType.findOne({ name: modelType, make: makeId }, function (err, make) {
            if (err)
                throw err;
            else
                resolve(make);
        });
    });
}
function findModelId(makeId, modelType) {
    return new Promise(function (resolve) {
        console.log('findModelId makeId:');
        console.log('makeId:', makeId);
        console.log('modelType:', modelType);
        findModel(makeId, modelType).then(function (modelType) {
            console.log("RES", modelType);
            if (!modelType)
                resolve(modelType);
            resolve(modelType._id);
        });
    });
}
// filters
function findFilters(query) {
    return new Promise(function (resolve) {
        FilterModel_1.Filter.find(query, function (err, filters) {
            if (err)
                throw err;
            resolve(filters);
        });
    });
}
function updateFilter(filterId, newFilter) {
    return new Promise(function (resolve) {
        FilterModel_1.Filter.findOneAndUpdate({ _id: filterId }, newFilter, { upsert: true }, function (err, filter) {
            if (err)
                throw err;
            resolve(filter);
        });
    });
}
function getFilterById(id) {
    return new Promise(function (resolve) {
        FilterModel_1.Filter.findById(id, function (err, filter) {
            if (err)
                throw err;
            resolve(filter);
        });
    });
}
function getFilterByIdFull(id) {
    return new Promise(function (resolve) {
        FilterModel_1.Filter.findById(id).populate([
            { path: 'make' },
            { path: 'modelType' }
        ]).exec().then(function (filter) {
            resolve(filter);
        });
    });
}
function updateProvider(name, newProvider) {
    return new Promise(function (resolve) {
        ProviderModel_1.Provider.findOneAndUpdate({ name: name }, newProvider, { upsert: true }, function (err, provider) {
            if (err)
                throw err;
            resolve(provider);
        });
    });
}
function updateFuelType(name, newFuelType) {
    return new Promise(function (resolve) {
        FuelTypeModel_1.FuelType.findOneAndUpdate({ name: name }, newFuelType, { upsert: true }, function (err, fuelType) {
            if (err)
                throw err;
            resolve(fuelType);
        });
    });
}
function findProviderId(provider) {
    return new Promise(function (resolve) {
        ProviderModel_1.Provider.findOne({ name: provider }, function (err, provider) {
            if (err)
                throw err;
            resolve(provider ? provider._id : null);
        });
    });
}
function getProviders() {
    return new Promise(function (resolve) {
        ProviderModel_1.Provider.find({}, function (err, providers) {
            if (err)
                throw err;
            resolve(providers);
        });
    });
}
function getProvider(id) {
    return new Promise(function (resolve) {
        ProviderModel_1.Provider.findById(id, function (err, provider) {
            if (err)
                throw err;
            resolve(provider);
        });
    });
}
function getFuelTypes() {
    return new Promise(function (resolve) {
        FuelTypeModel_1.FuelType.find({}, function (err, fuelTypes) {
            if (err)
                throw err;
            resolve(fuelTypes);
        });
    });
}
;
function loadAllMakesFull() {
    return new Promise(function (resolve) {
        MakeModel_1.Make.find({})
            .populate([{ path: 'modelsTypes' }])
            .exec().then(function (makes) {
            resolve(makes);
        });
    });
}
function createFilter(filter) {
    return new Promise(function (resolve) {
        FilterModel_1.Filter.create(filter, function (err, filter) {
            if (err) {
                throw err;
            }
            resolve(filter);
        });
    });
}
function removeFilter(filterId) {
    return new Promise(function (resolve) {
        FilterModel_1.Filter.remove({ _id: filterId }, function (err) {
            if (!err) {
                resolve(true);
            }
        });
    });
}
function findOrderById(orderId) {
    return new Promise(function (resolve) {
        OrderModel_1.Order.findById(orderId, function (err, order) {
            if (err)
                throw err;
            resolve(order);
        });
    });
}
function findUserOrders(userId) {
    return new Promise(function (resolve) {
        OrderModel_1.Order.find({ user: userId })
            .populate([
            {
                path: 'filters',
                populate: [
                    { path: 'modelType' },
                    { path: 'make' },
                    { path: 'fuel2' },
                    { path: 'providers' }
                ]
            }
        ])
            .exec().then(function (orders) {
            resolve(orders);
        });
    });
}
function createOrder(order) {
    return new Promise(function (resolve) {
        OrderModel_1.Order.create(order, function (err, order) {
            if (err)
                throw err;
            resolve(order);
        });
    });
}
function createMake(make) {
    return new Promise(function (resolve) {
        MakeModel_1.Make.create(make, function (err, make) {
            if (err)
                throw err;
            resolve(make);
        });
    });
}
function createTransaction(transaction) {
    return new Promise(function (resolve) {
        TransactionModel_1.Transaction.create(TransactionModel_1.Transaction, function (err, transaction) {
            if (err)
                throw err;
            resolve(transaction);
        });
    });
}
/* Ads */
function orAdExist(ad) {
    return new Promise(function (resolve) {
        AdModel_1.Ad.findOne({ filter: ad.filter, providerAdId: ad.providerAdId }, function (err, ad) {
            resolve(ad !== null);
        });
    });
}
