const db = require('../helpers/jsonDB').db;

module.exports = {
    name: 'mambu-create-client',
    resolve: async (input , task) => {
        const variables = db.getData('/handlers/mambu-create-client');
        return variables;
    }
}