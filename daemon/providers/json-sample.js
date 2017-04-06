'use strict';

const logger = require('common').logger;

const AdProvider = require('./ad-provider');

class Caca extends AdProvider {

    constructor() {
        super();
        this.name = 'Caca';
        this.initialPage = -1;
        this.maxResults = 5;
    }

    static _parse(obj) {
        return {
            landingUrl: obj.id
        };
    }

    getRequestOptions() {
        return {};
    }

    getFetchUrl(page) {
        const fetchTemplateUrl = 'https://dhtmlx.com/docs/products/dhtmlxGrid/samples/common/data.json?dhxr1491421584419=1&';
        return fetchTemplateUrl + (page || 0);
    }

    parseResults(body, cb) {
        console.log(body);
        var body = body.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
        var json = JSON.parse(body);
        var rows = json.rows;
        if (!rows.length) {
            return [];
        }
        var results = [];
        rows.map(function (el) {
            var ad = Caca._parse(el);
            results.push(ad);
        });

        cb(null, results);
    }
}

module.exports = Caca;