var API = require('common-api').API,
	Q = require('q');

var Nominatim = function(language, email) {
	this.language = language;
	this.email = email;
};

Nominatim.prototype = new API({
    hostname: 'nominatim.openstreetmap.org',
    format:   API.FORMAT.JSON,
    urlTransform: function(url) {
    	if (this.email) {
    		return url + "&email=" + this.email;
    	} else {
    		return url;
    	}
    }
});

Nominatim.prototype.search = function(query) {
	var deferred = Q.defer();

	var params = {
		format: 'json',
		limit: 3,
		addressdetails: 1,
		q: query
	};

	if (this.language) {
		params['accept-language'] = this.language;
	}

	this.call('search', params).then(function(data) {
		deferred.resolve(data);

	}, function(err) {
		deferred.reject({
			type: 'callfail',
			description: err
		});
	});

	return deferred.promise;
};

Nominatim.prototype.reverse = function(lat, lon) {
	var deferred = Q.defer();

	var params = {
		format: 'json',
		lat: lat,
		lon: lon
	};

	this.call('reverse', params).then(function(data) {
		deferred.resolve(data);

	}, function(err) {
		deferred.reject({
			type: 'callfail',
			description: err
		});
	});

	return deferred.promise;
};

exports.Nominatim = Nominatim;
