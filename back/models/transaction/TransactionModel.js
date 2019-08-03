"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var transactionSchema = new mongoose_1.Schema({
    data: { type: mongoose_1.Schema.Types.Mixed }
});
exports.Transaction = mongoose_1.model("Transaction", transactionSchema);
