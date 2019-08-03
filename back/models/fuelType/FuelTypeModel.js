"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.fuelTypeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    webName: { type: String }
});
exports.FuelType = mongoose_1.model("FuelType", exports.fuelTypeSchema);
