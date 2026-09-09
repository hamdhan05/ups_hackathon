'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const { getForecasts } = require('../controllers/forecastController');

const router = express.Router();

router.get('/', auth, getForecasts);

module.exports = router;
