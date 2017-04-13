'use strict';

const cheerio = require('cheerio');
const AdProvider = require('./ad-provider');
const request = require('request');
const common = require('common');
const hostUrl = "http://clasificados.cadena3.com/";
const searchTemplateUrl = "avisos.asp?&categoria=Veh%EDculos&rubro=6&provincia=Cordoba&porprecio=&texto=urgente&direction=";

class Cadena3Provider extends AdProvider {

    constructor() {
        super();
        this.name = 'cadena3-cars';
        this.initialPage = 0;
        this.maxResults = this.pagingStep * 4;
        this.maxResults = 1;
    }

    getRequestOptions() {
        return {};
    }

    getFetchUrl(page) {
        return hostUrl + searchTemplateUrl + (page || 1);
    }

    parseResponse(body, cb) {
        const $ = cheerio.load(body);
        var $ads = $('.bloque-resultado');
        if (!$ads.length) {
            return [];
        }

        var results = [];
        $ads.each((index, el) => {
            var ad = {
                permanentLink: hostUrl + $(el).find("a").attr("href") 
            };
            console.log(ad.permanentLink);
            request(ad.permanentLink, {}, (error, response, body) => {
                const $ = cheerio.load(body);
                //console.log(body);
                var pictures = [];
                //find images
                $("#mygallery").find("img").map((i, el) => { pictures.push($(el).attr('src')); });
                ad.pictures = pictures;
                ad.thumbnail = pictures[0];
                ad.title = $("#content").find("h1").first().text();
                ad.price = $(".orange").text().toNumber();
                ad.currency = "ARG";
                results.push(ad);

                //all ads processed
                if (results.length == $ads.length)
                    cb(null, results);
            });
        });

        function parse($el) {
            var $info = $el.find('.Info');
            var $modelo = $el.find('.Modelo');
            var pubDate = $info.find('div.pie-aviso-teaser').text().toDate();
            return {
                description: $el.find('.Descripcion').text().trim(),
                title: $modelo.text().trim(),
                permalink: $el.find('a').attr('href'),
                fuel: $info.find('.combustible').text(),
                model: $info.find('.anio').text(),
                mileage: $info.find('.km').text(),
                price: $info.find('.cifra').text().trim(),
                currency: "ARG",
                publishedOn: pubDate,
                updatedOn: pubDate,
            };
        }
    }
}

module.exports = Cadena3Provider;