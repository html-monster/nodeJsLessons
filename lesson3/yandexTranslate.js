const request = require('request');
const url = require('url');

getTranslate('привет, хочу жареных котлет');

function getTranslate(string) {
	const yandexApiUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
	const yandexKey = 'trnsl.1.1.20161028T182327Z.c054ad905ab651e2.1cc01e6163df2dd589673430a8b8e44674d38ba0';
	let translateDirection;

	if(string.replace(/[^A-Za-z]+/g, '').length)//определение направления перевода
		translateDirection = 'en-ru';
	else
		translateDirection = 'ru-en';

	let urlParams = url.parse(yandexApiUrl, true); //сборка с помощью модуля url, чтобы была возможность перекодировать кириллицу в нужный формат
	urlParams.query = {
		key: yandexKey,
		lang: translateDirection,
		text: string
	};

	request(url.format(urlParams), function(error, response, json) {
		if(error)
			throw error;

		if(response.statusCode !== 200)
			return console.log('incorrect status: ', response.statusCode);

		console.log(JSON.parse(json).text[0]);// в ответ приходит json, распасиваем его и выбираю нужный элемнт с переводом
	});
}