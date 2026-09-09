'use strict';

const mongoose = require('mongoose');

const capacitySchema = new mongoose.Schema(
  {
    planningDate: { type: Date, required: true },
    operationType: { type: String, required: true },
    operationalArea: { type: String, required: true },
    forecastWorkload: { type: Number, required: true, min: 0 },
    requiredWorkforce: { type: Number, required: true, min: 0 },
    availableWorkforce: { type: Number, required: true, min: 0 },
    capacityGap: { type: Number, required: true },
    utilization: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['UNDER_CAPACITY', 'BALANCED', 'OVER_CAPACITY'],
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    },
    forecastReference: { type: mongoose.Schema.Types.ObjectId, ref: 'Forecast' },
  },
  { timestamps: true }
);

capacitySchema.index({ planningDate: 1, operationType: 1 });
capacitySchema.index({ operationalArea: 1, planningDate: 1 });

module.exports = mongoose.model('Capacity', capacitySchema);
