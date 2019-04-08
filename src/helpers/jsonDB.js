const JsonDB = require('node-json-db');

const db = new JsonDB(
    'src/database/database',     // db name
    true,                       // run save() on each push
    true,                      // save in human readable
    '/'                       // query separator
);

module.exports = {
    db
}
