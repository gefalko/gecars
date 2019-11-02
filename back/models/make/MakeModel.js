"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var makeSchema = new mongoose_1.Schema({
    make: {
        type: String,
        required: true
    },
    modelTypes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'ModelType' }]
});
exports.Make = mongoose_1.model("Make", makeSchema);
