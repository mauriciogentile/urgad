if (!String.prototype.toDate) {
    String.prototype.toDate = function () {
        var str = this;
        var str = str.replace(/[^0-9\.]+/g, "").replace(/[\.\-]+/g, "/");
        return new Date(Date.parse(str));
    };
}