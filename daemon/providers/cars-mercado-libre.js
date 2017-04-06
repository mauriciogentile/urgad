'use strict';

const cheerio = require('cheerio');
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
        var $resultContainer = $('.results-item.article');
        if (!$resultContainer.length) {
            return [];
        }

        var results = [];
        $resultContainer.each(function (index, el) {
            var $el = $(el);
            var ad = parse($el);
            results.push(ad);
        });

        cb(null, results);

        function parse($el) {
            var $item = $el.find('.rowItem');
            var title = $item.find('.list-view-item-title').find('h2').text();
            var url = $item.find('.list-view-item-title').find('a').attr('href');
            var images = $item.find('.carusel').find('img').attr('src');
            return {
                description: $el.find('.Descripcion').text().trim(),
                title: title,
                url: url,
                thumbnail: images[0],
                images: images,
                /*fuel: $info.find('.combustible').text(),
                make: $info.find('.anio').text(),
                mileage: $info.find('.km').text(),
                price: $info.find('.cifra').text().trim()*/
            };
        }
    }
}

module.exports = MercadoLibreProvider;