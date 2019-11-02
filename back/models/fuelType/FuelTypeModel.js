"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
exports.fuelTypeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    webName: { type: String }
});
exports.FuelType = mongoose_1.model("FuelType", exports.fuelTypeSchema);
