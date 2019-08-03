"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpSer = require("../services/http.service");
class httpRequest {
    getHtml(url) {
        return httpSer.getHtml(url);
    }
}
exports.httpRequest = httpRequest;
