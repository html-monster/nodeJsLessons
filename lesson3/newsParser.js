'use strict';

const request = require('request');
const cheerio = require('cheerio');
const async = require('async');
const fs = require('node-fs');

/**
* Take news from BBC
* availableCategories: 'business', 'magazine', 'technology', 'uk', 'world'
* @param categories
*/
getNewsFromBBC(
		'science'
);

function getNewsFromBBC(...categories) {
	const rootUrl = 'http://www.bbc.com/news/';
	const availableCategories = [
			'business',
			'magazine',
			'technology',
			'uk',
			'world'
	];

	categories.forEach(function (item) {
		if(searchValueInArray(availableCategories, item) == -1)
			return console.log(item + ' - wrong category!!!');

		parseNews(rootUrl + item, item)
	});

	function searchValueInArray(array, value) {
		for (let ii = 0; ii < array.length; ii++) {
			if (array[ii] === value) return ii;
		}

		return -1;
	}

	function parseNews(url, categoryUrl) {
		async.waterfall([

			function (callback) {
				request(url, function(error, response, html) {
					if(error)
						throw error;

					if(response.statusCode !== 200)
						return console.log('incorrect status: ', response.statusCode);
					callback(null, html);
				});
			},

			function (html, callback) {
				let $ = cheerio.load(html),
						siteUrl = rootUrl.slice(0, -6),
						newsUrls = [];

				newsUrls.push(siteUrl + $('#comp-pattern-library-5 a.title-link').attr('href'));
				newsUrls.push(siteUrl + $('#comp-candy-asset-munger-2 .pigeon__column--a:nth-child(1) a.title-link').attr('href'));
				newsUrls.push(siteUrl + $('#comp-candy-asset-munger-2 .pigeon__column--a:nth-child(2) a.title-link').attr('href'));
				newsUrls.push(siteUrl + $('#comp-candy-asset-munger-2 .pigeon__column--b .pigeon-item:nth-child(1) a.title-link').attr('href'));
				newsUrls.push(siteUrl + $('#comp-candy-asset-munger-2 .pigeon__column--b .pigeon-item:nth-child(2) a.title-link').attr('href'));
				newsUrls.push(siteUrl + $('#comp-candy-asset-munger-2 .pigeon__column--b .pigeon-item:nth-child(3) a.title-link').attr('href'));

				callback(null, newsUrls);
			},

			function (newsUrls, callback) {
				newsUrls.forEach(function (item) {
					// console.log(item);
					request(item, function(error, response, html) {
						if(error)
							throw error;

						if(response.statusCode !== 200)
							return console.log('incorrect status: ', response.statusCode);

						let $ = cheerio.load(html);
						let fileName = $('h1').text().replace(/[^A-Za-z\s]+/g, '');
						let article = $('.story-body');
						article.find('script, form').remove();

						fs.writeFile('./news/' + categoryUrl + '/' + fileName + '.html', article, function (error) {
							if(error)
								throw  error;
						});
						// console.log(html);
						// console.log('===================================================================================');
						// callback(null, newsContent);
					});
				});
				// console.log(newsContent);
			}

		], function (error, result) {
			if(error)
				throw error;

			console.log('all ok');
		});

	}
}



