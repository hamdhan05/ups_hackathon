'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const { getCapacity } = require('../controllers/capacityController');

const router = express.Router();

router.get('/', auth, getCapacity);

module.exports = router;
