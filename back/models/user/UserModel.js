"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String },
    orders: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Order' }],
    createdOn: { type: Date },
    hash: { type: String },
    salt: { type: String }
});
exports.User = mongoose_1.model("User", userSchema);
