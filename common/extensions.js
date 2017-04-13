if (!String.prototype.toDate) {
    String.prototype.toDate = function () {
        var str = this;
        var str = str.replace(/[^0-9\.]+/g, "").replace(/[\.\-]+/g, "/");
        return new Date(Date.parse(str));
    };
}

if (!String.prototype.toNumber) {
    String.prototype.toNumber = function () {
        var str = this;
        var str = str.replace(/[^0-9\.]+/g, "");
        return Number(str);
    };
}