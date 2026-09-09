'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const { getOperations } = require('../controllers/operationsController');

const router = express.Router();

router.get('/', auth, getOperations);

module.exports = router;
