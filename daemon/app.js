'use strict';

const providers = require('./providers');
const logger = require('common').logger;

var runAll = function (provs) {
    var fetchPromises = provs.map(function (provider) {
        return provider.fetch();
    });

    Promise.all(fetchPromises).then(data => {
        data.map(results => {
            results.map(function (el) {
                console.log('debug', el);
            });
        });
        logger.log('info', 'Done!');
    }).catch(error => { logger.log('error', error) });
};


setImmediate(runAll, providers);
setInterval(runAll, 100 * 1000, providers);