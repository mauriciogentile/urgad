'use strict';

const request = require('request');
const logger = require('common').logger;

class AdProvider {
    constructor() {
    }

    fetch() {
        return new Promise((resolve, reject) => {
            var results = [];
            var page = this.initialPage || 0;
            var pageStep = this.pagingStep || 1;
            const maxResults = this.maxResults || 100;
            var self = this;

            var fetch = function () {
                var fetchUrl = self.getFetchUrl(page);
                request(fetchUrl, self.getRequestOptions(), function (error, response, body) {
                    if (response.statusCode > 299) {
                        reject('Error fetching ads from ' + self.name);
                        return;
                    }
                    logger.log('info', response.statusCode);
                    logger.log('info', fetchUrl);
                    if (error) {
                        reject('Error fetching ads from ' + self.name);
                        return;
                    }

                    self.parseResults(body, (error, results1) => {
                        results = results.concat(results1);
                        if (!results1.length || page < 0 || results.length >= maxResults) {
                            resolve(results);
                            return;
                        }
                        else {
                            page = page + pageStep;
                            fetch();
                        }
                    });
                });
            };

            fetch();
        });
    }
}

module.exports = AdProvider;