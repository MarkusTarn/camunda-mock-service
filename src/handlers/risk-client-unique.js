const db = require('../helpers/jsonDB').db;

module.exports = {
    name: 'risk-client-unique',
    resolve: async (input , task) => {
        const variables = db.getData('/handlers/risk-client-unique');
        return variables;
    }
}