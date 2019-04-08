const db = require('../helpers/jsonDB').db;

module.exports = {
    name: 'risk-autocam-decision',
    resolve: async (input , task) => {
        const variables = db.getData('/handlers/risk-autocam-decision');
        return variables;
    }
}