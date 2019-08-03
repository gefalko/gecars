/// <reference path="../typings/index.d.ts" />

export interface requestHtmlInterface {
    getHtml(url: string): Promise<string>
}
