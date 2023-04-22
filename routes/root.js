const express = require('express');
const router = express.Router();
const cors = require('cors');
const path = require('path');

router.use(cors());

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;