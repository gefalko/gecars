"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const providerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    country: { type: String },
    webImage: { type: String },
    webName: { type: String }
});
exports.Provider = mongoose_1.model("Provider", providerSchema);
