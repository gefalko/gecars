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
const gecar = require('./../services/collector.service');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const mongoose = require('mongoose');
require('./../models/db');
const ModelTypeModel_1 = require("../models/modelType/ModelTypeModel");
const UserModel_1 = require("../models/user/UserModel");
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'email@gmail.com',
        pass: 'password'
    }
});
function sendMail(to, ads) {
    console.log("Send mail to", to);
    if (ads.length < 1)
        return;
    let mail = '<h3>Sveiki, Jūsų skelbimai!</h3><table>';
    let promises = [];
    for (const ad of ads) {
        promises.push(ModelTypeModel_1.ModelType.findById(ad.modelType).populate('make').exec(function (err, modelType) {
            const title = (modelType == null) ? ad.title : `${modelType.make.make} ${modelType.name}`;
            console.log('AD:', ad);
            mail += `<tr>
                <td>
                    <a href="${ad.url}"><img style="width:130px" src="${ad.img}"></a>    
                </td>
                <td>
                    <a href="${ad.url}">
                        <div>${title}</div> 
                        <div>metai:${ad.year}</div>
                        <div>kaina:${ad.price}</div>
                        <div>filtro id:${ad.filter}</div>
                        <div>puslapis:${ad.strategy}</div>
                    </a>
                </td>
           </tr>`;
        }));
    }
    Promise.all(promises).then(function () {
        mail += '</table>';
        let mailOptions = {
            from: 'skelbimai@gecar.lt',
            to: to,
            subject: 'gecars - nauji skelbimai ✔',
            text: mail,
            html: mail // html body
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    });
}
const collectOrders = function (debug) {
    return __awaiter(this, void 0, void 0, function* () {
        // load users
        console.log('Start collect orders.');
        let users;
        try {
            users = yield UserModel_1.User.find({}).populate({
                path: 'orders',
                populate: [{
                        path: 'filters',
                        model: 'Filter',
                        populate: [{ path: 'providers' }, { path: 'make', modelType: 'Make' }, {
                                path: 'modelType',
                                modelType: 'modelType'
                            },]
                    }, { path: 'user', model: 'User' }]
            });
        }
        catch (e) {
            console.log('error while getting users');
            console.log(e);
        }
        console.log('users');
        console.log(JSON.stringify(users));
        for (let user of users) {
            for (let order of user.orders) {
                /*
                 while(order.filters.length > 3){
                 order.filters.pop();
                 }*/
                try {
                    const ads = yield gecar.collectOrder(order);
                    console.log("Send Total ads:", ads.length);
                    console.log("Of user:", ads.length);
                    sendMail('email@gmail.com', ads);
                    if (!debug)
                        sendMail(order.user.email, ads);
                }
                catch (err) {
                    console.log(err.stack);
                    console.log(err);
                }
            }
        }
        return true;
    });
};
const args = process.argv.slice(2);
console.log("Application command line arguments", args);
setTimeout(() => collectOrders(true), 1000);
if (args[0] == 'debug') {
    collectOrders(true);
}
// cron.schedule('0 * * * *', function () {
//     console.log('running a task every hour');
//     collectOrders(false);
// });
