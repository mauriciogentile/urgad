'use strict';

const request = require('request');

class AdProvider {
    constructor() {
    }

    fetch() {
        return new Promise((resolve, reject) => {
            var results = [];
            var page = this.initialPage || 0;
            var self = this;

            var fetch = function () {
                var fetchUrl = self.getFetchUrl(page);
                request(fetchUrl, self.getRequestOptions(), function (error, response, body) {
                    if (response.statusCode > 299) {
                        reject('Error fetching ads from ' + self.name);
                        return;
                    }
                    console.log(response.statusCode);
                    console.log(fetchUrl);
                    if (error) {
                        reject('Error fetching ads from ' + self.name);
                        return;
                    }

                    var results1 = self.parseResults(body);
                    results = results.concat(results1);
                    if (!results1.length || page < 0) {
                        resolve(results);
                        return;
                    }
                    else {
                        page++;
                        fetch();
                    }
                });
            };

            fetch();
        });
    }
}

module.exports = AdProvider;