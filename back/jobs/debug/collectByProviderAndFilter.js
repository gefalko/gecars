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
const collector_service_1 = require("../../services/collector.service");
const UserModel_1 = require("../../models/user/UserModel");
const mongoose = require('mongoose');
require('../../models/db');
const provider = 'autotrader'; // 'autotrader', 'ebay
const filter = {
    make: {
        make: 'nissan',
    },
    modelType: {
        providersData: {},
        name: 'x-trail'
    },
    fuel: 'petrol',
    priceFrom: 0,
    priceTo: 3000,
    yearFrom: 1990,
    yearTo: 2020,
    providers: ['gumtree', 'ebay', 'autotrader'],
};
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    // Loading users allow ensure that db is ready.
    const users = yield UserModel_1.User.find({}).populate({
        path: 'orders',
        populate: [{
                path: 'filters',
                model: 'Filter',
                populate: [{ path: 'providers' }, { path: 'make', modelType: 'Make' }, { path: 'modelType', modelType: 'modelType' },]
            }, { path: 'user', model: 'User' }]
    });
    console.log('Users:', users);
    yield collector_service_1.collect(provider, filter);
});
start();
