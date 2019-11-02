"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
exports.filterSchema = new mongoose_1.Schema({
    order: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order', required: true },
    make: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Make', required: true },
    modelType: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ModelType', required: true },
    providers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Provider' }],
    priceFrom: { type: Number, required: true },
    priceTo: { type: Number, required: true },
    yearFrom: { type: Number, required: true },
    yearTo: { type: Number, required: true },
    fuel: String,
    //for new version of fuels
    status: { type: Number, "default": 0 },
    fuel2: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order' }
});
exports.Filter = mongoose_1.model("Filter", exports.filterSchema);
