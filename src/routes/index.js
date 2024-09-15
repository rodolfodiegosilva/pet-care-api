const express = require('express');
const authRoutes = require('./auth');
const petRoutes = require('./pets');
const serviceRoutes = require('./services');
const appointmentRoutes = require('./appointments');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/pets', petRoutes);
router.use('/services', serviceRoutes);
router.use('/appointments', appointmentRoutes);

module.exports = router;
