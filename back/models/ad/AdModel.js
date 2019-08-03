"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adSchema = new mongoose_1.Schema({
    filter: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Filter', required: true },
    modelType: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ModelType', required: true },
    make: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Make', required: true },
    title: String,
    year: Number,
    price: Number,
    fuel: String,
    providerAdId: String,
    url: String,
    img: String
});
exports.Ad = mongoose_1.model("Ad", adSchema);
