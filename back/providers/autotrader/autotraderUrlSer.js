module.exports = {
    getFilterUrl: getFilterUrl,
    getPageUrls: getPageUrls
};
function getFilterUrl(filter) {
    if (!filter)
        throw new Error('Filter is not defined');
    if (!filter.make || !filter.modelType)
        throw new Error('Incorrect filter object');
    var make = filter.make.make.toUpperCase();
    var model = filter.modelType.providersData && filter.modelType.providersData.autotrader ? filter.modelType.providersData.autotrader : filter.modelType.name.toUpperCase();
    var fuel = filter.fuel ? '&fuel-type=' + filter.fuel.capitalize() : '';
    var yearFrom = filter.yearFrom ? '&year-from=' + filter.yearFrom : '';
    var yearTo = filter.yearTo ? '&year-to=' + filter.yearTo : '';
    var priceFrom = filter.priceFrom ? '&price-from=' + filter.priceFrom : '';
    var priceTo = filter.priceTo ? '&price-to=' + filter.priceTo : '';
    return 'http://www.autotrader.co.uk/car-search?postcode=dn91jf&make=' + make + '&model=' + model + fuel + yearFrom + yearTo + priceFrom + priceTo;
}
function getPageUrls(url, totalPages) {
    if (!url) {
        throw new Error('Url is not defined');
    }
    if (!totalPages) {
        throw new Error('TotalPages is not defined');
    }
    var urls = [];
    for (var i = 1; i < totalPages + 1; i++) {
        urls.push(url + '&page=' + i);
    }
    return urls;
}
