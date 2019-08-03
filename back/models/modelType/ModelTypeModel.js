"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const modelTypeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    make: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Make' },
    providersData: {
        autotrader: String,
        ebay: String,
        gumtree: mongoose_1.Schema.Types.Mixed
    }
});
exports.ModelType = mongoose_1.model("ModelType", modelTypeSchema);
