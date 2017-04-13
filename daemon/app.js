'use strict';

const logger = require('common').logger;

var getProviders = function () {
    const providers = require('./providers');
    const provider = process.argv[2];

    logger.log("info", provider);
    var providersToRun = []

    providers.forEach(val => {
        if (!provider) {
            providersToRun.push(val);
        }
        else if (provider && provider == val.name) {
            providersToRun.push(val);
        }
    });
    return providersToRun;
}; 

var run = function (provs) {
    provs.map(function (provider) {
        provider.on('done', results => {
            results.map(function (el) {
                logger.log('debug', el);
            });
            logger.log('info', 'Done!!!!');
            console.dir(results);
        });
        provider.on('error', error => {
            logger.log('error', error);
        });
        return provider.search();
    });
};

var providers = getProviders();

setImmediate(run, providers);
//setInterval(run, 100 * 1000, providers);