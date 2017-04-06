'use strict';

const path = require("path");
var providers = [];

require("fs").readdirSync(__dirname).forEach(function (file) {
    if (file != "index.js" && file != "ad-provider.js") {
        var provider = require("./" + file);
        providers.push(new provider());
    }
});

module.exports = providers;