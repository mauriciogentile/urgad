'use strict';

const EventEmitter = require('events');
const util = require('util');
const request = require('request');
const logger = require('common').logger;

class AdProvider extends EventEmitter {
    constructor() {
        super();
    }

    search() {
        var self = this;
        var results = [];
        var page = this.initialPage || 0;
        var pageStep = this.pagingStep || 1;
        const maxResults = this.maxResults || 100;

        var search = function () {
            var fetchUrl = self.getFetchUrl(page);
            request(fetchUrl, self.getRequestOptions(), function (error, response, body) {
                if (response && response.statusCode > 299 && response.statusCode != 404) {
                    console.log(response.statusCode);
                    self.emit('error', util.format("Error fetching ads from '%s' url '%s'. Status is '%s' '%s'",
                        self.name, fetchUrl, response.statusCode, response.statusMessage));
                    return;
                }
                if (error) {
                    self.emit('error', util.format("Error fetching ads from '%s' url '%s'.",
                        self.name, fetchUrl));
                    return;
                }
                if (response && response.statusCode == 404 && results.length) {
                    self.emit('done', results);
                    return;
                }
                if (body) {
                    self.parseResponse(body, (error, results1) => {
                        results = results.concat(results1);
                        if (!results1.length || page < 0 || results.length >= maxResults) {
                            self.emit('done', results);
                            return;
                        }
                        else {
                            page = page + pageStep;
                            search();
                        }
                    });
                }
            });
        };

        search();
    }
}

module.exports = AdProvider;