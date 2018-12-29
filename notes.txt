npm init = инициализация проекта. создается файл package.json
npm i webpack --save-dev = установка как зависимость разработки только локально

npm i jquery --save = установка глобально для проекта

for installing all dependencies, use this command = npm install

npm uninstall jquery --save = unistall package

npm install live-server --global = install package global
npm install -g live-server
live-server = for creating server for sites

http://127.0.0.1:8080/
live-server - запускает локально сервер
live-server install onlly globally

webpack-cli = plugin for work in webpack in webpack cmd

npm run dev - запустить тот скрипт, который лежит в конфигурации

// entry - where we have file and output - where we want to put file
const path = require('path');

module.exports = {
	entry: './src/js/index.js',
	output: {
		path: path.resolve(__dirname, 'dist/js'),
		filename: 'bundle.js'
	},
	mode: 'development'
};

webpack server helps restrart sever while we save new code

.babelrc - конфигурационный файл для  настройки бабеля