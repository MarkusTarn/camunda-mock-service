const JsonDB = require('node-json-db');

const db = new JsonDB(
    'src/database/database',     // db name
    true,                       // run save() on each push
    true,                      // save in human readable
    '/'                       // query separator
);

const migrateDB = async () => {
    try {
        db.get('/handlers') == ''
    } catch(error) {
        db.push('/', {
            "handlers": {
                "mambu-create-client": {
                    "status": "registred",
                    "loans": "0"
                },
                "risk-autocam-decision": {
                    "decision": "1"
                },
                "risk-client-unique": {
                    "unique": "1"
                },
                "salesforce-create-client": {
                    "clientID": 0,
                    "name": "Alvin"
                }
            }
        });
    }
};

module.exports = {
    db,
    migrateDB
}
