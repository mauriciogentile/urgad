'use strict';

const cheerio = require('cheerio');
const AdProvider = require('./ad-provider');

class LaVozProvider extends AdProvider {

    constructor() {
        super();
        this.name = 'Clasificados La Voz - Cars';
        this.initialPage = 0;
    }

    static _parse($el) {
        var $info = $el.find('.Info');
        var $modelo = $el.find('.Modelo');
        return {
            description: $el.find('.Descripcion').text().trim(),
            title: $modelo.text().trim(),
            landingUrl: $modelo.find('a').attr('href'),
            thumbnail: $el.find('.foto').find('img').attr('src'),
            fuel: $info.find('.combustible').text(),
            make: $info.find('.anio').text(),
            mileage: $info.find('.km').text(),
            price: $info.find('.cifra').text().trim()
        };
    }

    getRequestOptions() {
        return {};
    }

    getFetchUrl(page) {
        const fetchTemplateUrl = 'http://www.clasificadoslavoz.com.ar/search/apachesolr_search/urgente%20vendo?f[0]=im_taxonomy_vid_34%3A6323&page=';
        return fetchTemplateUrl + (page || 0);
    }

    parseResults(body) {
        const $ = cheerio.load(body);
        if (!$('.BoxResultado').length) {
            return [];
        }

        var results = [];
        $('.BoxResultado').each(function (index, el) {
            var $el = $(el);
            var ad = LaVozProvider._parse($el);
            results.push(ad);
        });

        return results;
    }
}

module.exports = LaVozProvider;