'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const { getBottlenecks } = require('../controllers/bottleneckController');

const router = express.Router();

router.get('/', auth, getBottlenecks);

module.exports = router;
