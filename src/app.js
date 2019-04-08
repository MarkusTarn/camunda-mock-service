const config = require('config');
const migrateDB = require('./helpers/jsonDB').migrateDB;
const join = require('path').join;
const express = require('express');
const json = require('express').json;
const es6Renderer = require('express-es6-template-engine');
const camundaProcessor = require('@myjar/camunda-processor').default;
const handlerController = require('./controllers/handlerController');
const app = express();

const mambuCreateClient = require('./handlers/mambu-create-client');
const riskAutocamDecision = require('./handlers/risk-autocam-decision');
const riskClientUnique = require('./handlers/risk-client-unique');
const salesforceCreateClient = require('./handlers/salesforce-create-client');

app.engine('html', es6Renderer);
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(express.static(join(__dirname, 'public')));
app.use(json());

const logResponse = (req, res, next) => { console.log('query: ', req.query); console.log('body: ', req.body); next(); };

app.use('/handlers', logResponse, handlerController);
app.use('/handlerss', (req, res) => res.json(migration.getData('/')));
app.get('/', logResponse, (req, res) => res.render('index'));

migrateDB();

const client = camundaProcessor([
    mambuCreateClient, 
    riskAutocamDecision, 
    riskClientUnique, 
    salesforceCreateClient
]);

const startMsg = `${process.env.npm_package_name} service started on port ${config.get('service.port') || 3000}.`;
app.listen(config.get('service.port' || 3000), () => console.log('info', startMsg));