"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Update simas filters
const filters = require('./../data_control/data/simasData/active');
const ser = require('../services/data.service');
const colors = require('colors');
const ObjectId = (require('mongoose').Types.ObjectId);
const UserModel_1 = require("../models/user/UserModel");
const OrderModel_1 = require("../models/order/OrderModel");
const MakeModel_1 = require("../models/make/MakeModel");
function formatProviders(providers) {
    return __awaiter(this, void 0, void 0, function* () {
        const ids = [];
        for (const provider of providers) {
            const id = yield ser.findProviderId(provider);
            if (!id) {
                throw new Error(`Provider ${provider} not exist in DB. Please insert provider.`);
            }
            ids.push(new ObjectId(id));
        }
        return ids;
    });
}
function updateFilter(orderId, rFilter, sFilter) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("FILTER FOR UPDATE", sFilter);
        //for update providers ->
        let uFilter = yield ser.updateFilter(rFilter._id, { $set: { providers: sFilter.providers, order: sFilter.order } });
        //update other data
        uFilter = yield ser.updateFilter(rFilter._id, sFilter);
        console.log("UPDATED FILTER", uFilter);
        console.log(`${sFilter.make}->${sFilter.modelType}  `);
        return uFilter;
    });
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield ser.findUser('ge4cars@gmail.com');
        if (!user) {
            const order = new OrderModel_1.Order();
            yield order.save();
            user = new UserModel_1.User({
                email: 'ge4cars@gmail.com',
                orders: [order]
            });
            yield user.save();
            user = yield ser.findUser('ge4cars@gmail.com');
        }
        const orderId = user.orders[0];
        const order = yield ser.findOrderById(orderId);
        order.filters = [];
        console.log('UPDATE FILTERS FOR ORDER :' + orderId);
        console.log(order);
        try {
            for (const filter of filters) {
                console.log("Process filter:", filter);
                const makeId = yield ser.findMakeId(capitalizeFirstLetter(filter.make));
                if (!makeId) {
                    const make = new MakeModel_1.Make({ _id: makeId, make: capitalizeFirstLetter(filter.make) });
                    yield make.save();
                    throw new Error("Make not exist: " + filter.make);
                }
                const modelId = yield ser.findModelId(makeId, capitalizeFirstLetter(filter.modelType));
                if (!modelId)
                    throw new Error("modelId not exist: " + filter.modelType);
                const sFilter = {
                    make: new ObjectId(makeId),
                    modelType: new ObjectId(modelId),
                    yearFrom: filter.yearFrom,
                    yearTo: filter.yearTo,
                    priceFrom: filter.priceFrom,
                    priceTo: filter.priceTo,
                };
                if (filter.fuel) {
                    sFilter.fuel = filter.fuel;
                }
                const rFilters = yield ser.findFilters(sFilter);
                sFilter.order = new ObjectId(orderId);
                sFilter.providers = yield formatProviders(filter.providers);
                console.log('Prepared filter to db:');
                console.log(sFilter);
                console.log("EXISTING DB FILTERS:", rFilters);
                if (rFilters.length > 1)
                    throw new Error("To many filters");
                if (rFilters.length == 0 && !filter.remove) {
                    console.log("Creating new filter:", sFilter);
                    const nFilter = yield ser.createFilter(sFilter);
                    order.filters.push(nFilter._id);
                    console.log("Created new filter:", nFilter);
                    console.log("Created!".green.bold);
                }
                else {
                    const rFilter = rFilters[0];
                    if (filter.remove) {
                        if (rFilter)
                            yield ser.removeFilter(rFilter._id);
                        console.log("Removed!".green.bold);
                    }
                    else {
                        const uFilter = yield updateFilter(orderId, rFilter, sFilter, filter);
                        order.filters.push(uFilter._id);
                        console.log("Updated!".green.bold);
                    }
                }
                console.log(" --------------------------------------- ".red);
            }
            OrderModel_1.Order.update({ _id: order.id }, order, function (err, raw) {
                if (err) {
                    throw err;
                }
                console.log("UPDATE ORDER!".bold.green, order);
                process.exit();
            });
        }
        catch (err) {
            console.log(err.message);
            console.log(err.stack);
        }
    });
}
init();
