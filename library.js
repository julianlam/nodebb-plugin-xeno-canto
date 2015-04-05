"use strict";

var controllers = require('./lib/controllers'),

	prepareRegex = /http:\/\/www\.xeno-canto\.org\/(\d+)/g,
	parseRegex = /\[xeno-canto:(\d+)\]/g,
	plugin = {};

plugin.prepare = function(input, callback) {
	var matches = input.match(prepareRegex),
		appendString = matches ? matches.map(function(url) {
			return '[xeno-canto:' + url.split('/').pop() + ']';
		}) : matches,
		output = input + (appendString ? ('\n' + appendString.join('')) : '');

	callback(null, output);
};

plugin.parse = function(input, callback) {
	callback(null, input.replace(parseRegex, function(match, embedId) {
		return '<iframe src="http://www.xeno-canto.org/' + embedId + '/embed?simple=1" scrolling="no" frameborder="0" width="340" height="115"></iframe>';
	}));
};

// McChicken please
var chickenWrapper = function(method, data, target, type, callback) {
	plugin[method](target, function(err, parsed) {
		if (err) {
			return callback(err);
		}

		if (type === 'post') {
			data.postData.content = parsed;
		} else if (type === 'signature') {
			data.userData.signature = parsed;
		}

		callback(null, data);
	});
}
plugin.preparePost = function(data, callback) {
	chickenWrapper('prepare', data, data.postData.content, 'post', callback);
};
plugin.prepareSignature = function(data, callback) {
	chickenWrapper('prepare', data, data.userData.signature, 'signature', callback);
};
plugin.parsePost = function(data, callback) {
	chickenWrapper('parse', data, data.postData.content, 'post', callback);
};
plugin.parseSignature = function(data, callback) {
	chickenWrapper('parse', data, data.userData.signature, 'signature', callback);
};

module.exports = plugin;