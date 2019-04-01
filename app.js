const express = require('express');
const config = require('config');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/random', (req, res) => res.json({ response: (Math.floor(Math.random() * Math.floor(2))) }));
app.get('/randomBoolean', (req, res) => res.json({ response: (Math.floor(Math.random() * Math.floor(2)) ? true : false) }));
app.get('/:param', (req, res) => res.json({ response: req.params.param }));

const startMsg = `${process.env.npm_package_name} service started on port ${config.get('service.port') || 3000}.`;
app.listen(config.get('service.port' || 3000), () => console.log('info', startMsg));