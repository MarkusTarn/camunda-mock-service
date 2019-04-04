const express = require('express');
const config = require('config');
const es6Renderer = require('express-es6-template-engine');
const join = require('path').join;
const app = express();
const logResponse = (req, res, next) => { console.log(req.query); next(); };

app.engine('html', es6Renderer);
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'html');

app.get('/respond', logResponse, (req, res) => res.json(req.query));
app.get('/random', (req, res) => res.json({ response: (Math.floor(Math.random() * Math.floor(2))) }));
app.get('/randomBoolean', (req, res) => res.json({ response: (Math.floor(Math.random() * Math.floor(2)) ? true : false) }));
app.get('/respond/:param', logResponse, (req, res) => res.json({ response: req.params.param }));
app.get('/', logResponse, (req, res) => res.render('index'));

const startMsg = `${process.env.npm_package_name} service started on port ${config.get('service.port') || 3000}.`;
app.listen(config.get('service.port' || 3000), () => console.log('info', startMsg));