import {AdInterface} from "../models/ad/AdInterface";

const gecar = require('./../services/collector.service');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

const mongoose = require('mongoose');
require('./../models/db');

import {ModelType} from '../models/modelType/ModelTypeModel'
import {User} from '../models/user/UserModel'

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'email@gmail.com',
        pass: 'password'
    }
});

function sendMail(to, ads: AdInterface[]) {

    console.log("Send mail to", to);

    if (ads.length < 1) return;

    let mail = '<h3>Sveiki, Jūsų skelbimai!</h3><table>';

    let promises = [];

    for (const ad of ads) {
        promises.push(ModelType.findById(ad.modelType).populate('make').exec(function (err, modelType) {

            const title = (modelType == null) ? ad.title : `${modelType.make.make} ${modelType.name}`;
            console.log('AD:', ad)
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

        mail += '</table>'

        let mailOptions = {
            from: 'skelbimai@gecar.lt', // sender address
            to: to, // list of receivers
            subject: 'gecars - nauji skelbimai ✔', // Subject line
            text: mail, // plain text body
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

const collectOrders = async function (debug) {
    // load users

    console.log('Start collect orders.')

    let users

    try {
        users = await User.find({}).populate({
            path: 'orders',
            populate: [{
                path: 'filters',
                model: 'Filter',
                populate: [{path: 'providers'}, {path: 'make', modelType: 'Make'}, {
                    path: 'modelType',
                    modelType: 'modelType'
                },]
            }, {path: 'user', model: 'User'}]
        });
    } catch (e) {
        console.log('error while getting users')
        console.log(e)
    }

    console.log('users')
    console.log(JSON.stringify(users))

    for (let user of users) {
        for (let order of user.orders) {

            /*
             while(order.filters.length > 3){
             order.filters.pop();
             }*/
            try {
                const ads = await gecar.collectOrder(order);
                console.log("Send Total ads:", ads.length);
                console.log("Of user:", ads.length);
                sendMail('email@gmail.com', ads);
                if (!debug) sendMail(order.user.email, ads);
            } catch (err) {
                console.log(err.stack);
                console.log(err);
            }
        }
    }
    return true;
}

const args = process.argv.slice(2);

console.log("Application command line arguments", args);
setTimeout(() => collectOrders(true), 1000)

if (args[0] == 'debug') {
    collectOrders(true);
}

// cron.schedule('0 * * * *', function () {
//     console.log('running a task every hour');
//     collectOrders(false);
// });

