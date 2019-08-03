"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const makeSchema = new mongoose_1.Schema({
    make: {
        type: String,
        required: true
    },
    modelTypes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'ModelType' }]
});
exports.Make = mongoose_1.model("Make", makeSchema);
