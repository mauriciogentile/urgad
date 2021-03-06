﻿'use strict';

const cheerio = require('cheerio');
const request = require('request');
const AdProvider = require('./ad-provider');
const util = require('util');

class MercadoLibreProvider extends AdProvider {

    constructor() {
        super();
        this.name = 'ml-cars';
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

    parseResponse(body, cb) {
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
                    description: "",
                    condition: obj.condition,
                    title: obj.title,
                    permalink: obj.permalink,
                    thumbnail: obj.thumbnail,
                    pictures: findPictures(obj.pictures),
                    publishedOn: obj.date_created,
                    updatedOn: obj.last_updated,
                    price: obj.price,
                    currency: "ARG",
                    mileage: findAttribute(obj.attributes, "MLA1744- KMTS"),
                    fuel: findAttribute(obj.attributes, "MLA1744-COMBUS"),
                    year: findAttribute(obj.attributes, "MLA1744-YEAR"),
                    make: findAttribute(obj.attributes, "MLA1744-MARC"),
                    model: findAttribute(obj.attributes, "MLA1744-MODL")
                };
                results.push(ad);

                //all ads processed
                if (results.length == $items.length)
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

        function findAttribute(attribs, attrid) {
            var mileage = null;
            attribs.map(el => {
                if (el.id == attrid) {
                    mileage = el.value_name;
                    return;
                }
            });
            return mileage;
        }
    }
}

module.exports = MercadoLibreProvider;