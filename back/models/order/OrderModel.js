"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var orderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    filters: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Filter' }],
    payed: { type: Boolean, "default": false },
    active: { type: Boolean, "default": false },
    status: { type: Number, "default": 0 },
    createDate: { type: Date, "default": Date.now },
    duration: { type: Number },
    start: { type: Date },
    end: { type: Date },
    transactions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Transaction' }]
});
exports.Order = mongoose_1.model("Order", orderSchema);
