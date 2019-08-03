import {requestHtmlInterface} from "../providers/requestHtmlInterface";

const httpSer = require("../services/http.service");

export class httpRequest implements requestHtmlInterface{

    public getHtml(url: string): Promise<string>{
        return httpSer.getHtml(url);
    }
}