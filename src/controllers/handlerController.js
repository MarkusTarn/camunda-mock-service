const router = require('express').Router();
const db = require('../helpers/jsonDB').db;

router.get('/', (req, res) => res.json(db.getData('/handlers')));

router.post('/', (req, res) => {
    const {name, key, value } = req.body;
    if (name, key, value) {
         return updateHandlerVariable(name, key, value).then(res.json({ message: 'success'}))
    }
    return res.json({ message: 'failure'})
});

router.patch('/', (req, res) => {
    const {name, key, value } = req.body;
    if (name, key, value) {
         return updateHandlerVariable(name, key, value).then(res.json({ message: 'success'}))
    }
    return res.json({ message: 'failure'})
});

async function updateHandlerVariable(name, key, value) {
    await db.push(`/handlers/${name}/${key}/`, value);
}

module.exports = router;