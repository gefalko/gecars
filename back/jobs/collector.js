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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var gecar = require('./../services/collector.service');
var nodemailer = require('nodemailer');
var cron = require('node-cron');
var mongoose = require('mongoose');
require('./../models/db');
var ModelTypeModel_1 = require("../models/modelType/ModelTypeModel");
var UserModel_1 = require("../models/user/UserModel");
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'email@gmail.com',
        pass: 'password'
    }
});
function sendMail(to, ads) {
    console.log('Send mail to', to);
    if (ads.length < 1)
        return;
    var mail = '<h3>Sveiki, Jūsų skelbimai!</h3><table>';
    var promises = [];
    var _loop_1 = function (ad) {
        promises.push(ModelTypeModel_1.ModelType.findById(ad.modelType)
            .populate('make')
            .exec(function (err, modelType) {
            var title = modelType == null
                ? ad.title
                : modelType.make.make + " " + modelType.name;
            console.log('AD:', ad);
            mail += "<tr>\n                <td>\n                    <a href=\"" + ad.url + "\"><img style=\"width:130px\" src=\"" + ad.img + "\"></a>    \n                </td>\n                <td>\n                    <a href=\"" + ad.url + "\">\n                        <div>" + title + "</div> \n                        <div>metai:" + ad.year + "</div>\n                        <div>kaina:" + ad.price + "</div>\n                        <div>filtro id:" + ad.filter + "</div>\n                        <div>puslapis:" + ad.strategy + "</div>\n                    </a>\n                </td>\n           </tr>";
        }));
    };
    for (var _i = 0, ads_1 = ads; _i < ads_1.length; _i++) {
        var ad = ads_1[_i];
        _loop_1(ad);
    }
    Promise.all(promises).then(function () {
        mail += '</table>';
        var mailOptions = {
            from: 'skelbimai@gecar.lt',
            to: to,
            subject: 'gecars - nauji skelbimai ✔',
            text: mail,
            html: mail
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    });
}
var collectOrders = function (debug) {
    return __awaiter(this, void 0, void 0, function () {
        var users, e_1, _i, users_1, user, _a, _b, order, ads, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    // load users
                    console.log('Start collect orders.');
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, UserModel_1.User.find({}).populate({
                            path: 'orders',
                            populate: [
                                {
                                    path: 'filters',
                                    model: 'Filter',
                                    populate: [
                                        { path: 'providers' },
                                        { path: 'make', modelType: 'Make' },
                                        {
                                            path: 'modelType',
                                            modelType: 'modelType'
                                        },
                                    ]
                                },
                                { path: 'user', model: 'User' },
                            ]
                        })];
                case 2:
                    users = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _c.sent();
                    console.log('error while getting users');
                    console.log(e_1);
                    return [3 /*break*/, 4];
                case 4:
                    console.log('users');
                    console.log(JSON.stringify(users));
                    _i = 0, users_1 = users;
                    _c.label = 5;
                case 5:
                    if (!(_i < users_1.length)) return [3 /*break*/, 12];
                    user = users_1[_i];
                    _a = 0, _b = user.orders;
                    _c.label = 6;
                case 6:
                    if (!(_a < _b.length)) return [3 /*break*/, 11];
                    order = _b[_a];
                    _c.label = 7;
                case 7:
                    _c.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, gecar.collectOrder(order)];
                case 8:
                    ads = _c.sent();
                    console.log('Send Total ads:', ads.length);
                    console.log('Of user:', ads.length);
                    sendMail('email@gmail.com', ads);
                    if (!debug)
                        sendMail(order.user.email, ads);
                    return [3 /*break*/, 10];
                case 9:
                    err_1 = _c.sent();
                    console.log(err_1.stack);
                    console.log(err_1);
                    return [3 /*break*/, 10];
                case 10:
                    _a++;
                    return [3 /*break*/, 6];
                case 11:
                    _i++;
                    return [3 /*break*/, 5];
                case 12: return [2 /*return*/, true];
            }
        });
    });
};
var args = process.argv.slice(2);
console.log('Application command line arguments', args);
setTimeout(function () { return collectOrders(true); }, 1000);
if (args[0] == 'debug') {
    collectOrders(true);
}
// cron.schedule('0 * * * *', function () {
//     console.log('running a task every hour');
//     collectOrders(false);
// });
