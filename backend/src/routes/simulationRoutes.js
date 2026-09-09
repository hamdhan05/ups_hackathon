'use strict';

const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/simulate', simulationController.runSimulation);

module.exports = router;
