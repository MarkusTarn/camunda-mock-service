const db = require('../helpers/jsonDB').db;

module.exports = {
    name: 'salesforce-create-client',
    resolve: async (input , task) => {
        const variables = db.getData('/handlers/salesforce-create-client');
        if (variables.clientID == 0) variables.clientID = Math.floor(100000 + Math.random() * 900000)
        return variables;
    }
}