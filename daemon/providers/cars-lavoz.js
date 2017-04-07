'use strict';

const cheerio = require('cheerio');
const AdProvider = require('./ad-provider');
const request = require('request');

class LaVozProvider extends AdProvider {

    constructor() {
        super();
        this.name = 'Clasificados La Voz - Cars';
        this.initialPage = 0;
    }

    getRequestOptions() {
        return {};
    }

    getFetchUrl(page) {
        const fetchTemplateUrl = 'http://www.clasificadoslavoz.com.ar/search/apachesolr_search/urgente%20vendo?f[0]=im_taxonomy_vid_34%3A6323&page=';
        return fetchTemplateUrl + (page || 0);
    }

    parseResults(body, cb) {

        const $ = cheerio.load(body);
        var $ads = $('.BoxResultado');
        if (!$ads.length) {
            return [];
        }

        var results = [];
        $ads.each(function (index, el) {
            var $el = $(el);
            var ad = parse($el);
            request(ad.permalink, {}, (error, response, body) => {
                const $ = cheerio.load(body);
                var pictures = [];
                $('img.imagecache').map((i, el) => { pictures.push($(el).attr('src')); });
                ad.pictures = pictures;
                ad.tumbnail = pictures[0];
                results.push(ad);

                //all ads processed
                if (results.length == $ads.length)
                    cb(null, results);
            });
        });

        function parse($el) {
            var $info = $el.find('.Info');
            var $modelo = $el.find('.Modelo');
            return {
                description: $el.find('.Descripcion').text().trim(),
                title: $modelo.text().trim(),
                permalink: $modelo.find('a').attr('href'),
                fuel: $info.find('.combustible').text(),
                make: $info.find('.anio').text(),
                mileage: $info.find('.km').text(),
                price: $info.find('.cifra').text().trim(),
                publishedOn: new Date($info.find('div.pie-aviso-teaser').text())
            };
        }
    }
}

module.exports = LaVozProvider;