'use strict';

const cheerio = require('cheerio');
const request = require('request');
const AdProvider = require('./ad-provider');
const util = require('util');

class MercadoLibreProvider extends AdProvider {

    constructor() {
        super();
        this.name = 'MercadoLibre - Cars';
        this.initialPage = 0;
        this.pagingStep = 49;
        this.maxResults = this.pagingStep * 4;
    }

    getRequestOptions() {
        return {};
    }

    getFetchUrl(page) {
        const fetchTemplateUrl = 'http://autos.mercadolibre.com.ar/vendo-urgente_Desde_%s_PciaId_cordoba';
        return util.format(fetchTemplateUrl, (page || 0));
    }

    parseResults(body, cb) {
        const $ = cheerio.load(body);
        const fetchItemUrlTemplate = 'https://api.mercadolibre.com/items/%s'
        var $items = $('.rowItem');
        if (!$items.length) {
            return [];
        }

        var results = [];
        $items.each(function (index, el) {
            var id = $(el).attr('id');
            var fetchItemUrl = util.format(fetchItemUrlTemplate, id);
            request(fetchItemUrl, {}, (error, response, body) => {
                var obj = JSON.parse(body);
                var ad = {
                    description: obj.description,
                    title: obj.title,
                    permalink: obj.permalink,
                    thumbnail: obj.thumbnail,
                    pictures: findPictures(obj.pictures),
                    publishedOn: obj.date_created,
                    updatedOn: obj.last_updated,
                    price: obj.price
                };
                results.push(ad);
                cb(null, results);
            });
        });

        function findPictures(pictures) {
            var images = [];
            pictures.map(pict => {
                images.push(pict.url);
            });
            return images;
        }
    }
}

module.exports = MercadoLibreProvider;