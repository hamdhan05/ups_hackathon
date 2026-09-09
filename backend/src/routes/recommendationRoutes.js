'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const { getRecommendations, updateRecommendation } = require('../controllers/recommendationController');

const router = express.Router();

router.get('/', auth, getRecommendations);
router.patch('/:id', auth, updateRecommendation);

module.exports = router;
