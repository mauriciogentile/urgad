'use strict';

const EventEmitter = require('events');
const util = require('util');
const request = require('request');
const logger = require('common').logger;

class AdProvider extends EventEmitter {
    constructor() {
        super();
    }

    fetch() {
        var self = this;
        return new Promise((resolve, reject) => {
            var results = [];
            var page = this.initialPage || 0;
            var pageStep = this.pagingStep || 1;
            const maxResults = this.maxResults || 100;

            var fetch = function () {
                var fetchUrl = self.getFetchUrl(page);
                request(fetchUrl, self.getRequestOptions(), function (error, response, body) {
                    if (response && response.statusCode > 299 && response.statusCode != 404) {
                        console.log(response.statusCode);
                        reject(util.format("Error fetching ads from '%s' url '%s'", self.name, fetchUrl));
                        return;
                    }
                    if (error) {
                        logger.log('error', error);
                        reject('Error fetching ads from ' + self.name);
                        return;
                    }
                    if (response && response.statusCode == 404 && results.length) {
                        resolve(results);
                        return;
                    }
                    if (body) {
                        self.parseResults(body, (error, results1) => {
                            results = results.concat(results1);
                            if (!results1.length || page < 0 || results.length >= maxResults) {
                                self.emit('done');
                                resolve(results);
                                return;
                            }
                            else {
                                page = page + pageStep;
                                fetch();
                            }
                        });
                    }
                });
            };

            fetch();
        });
    }
}

module.exports = AdProvider;