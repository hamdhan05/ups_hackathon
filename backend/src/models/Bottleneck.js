'use strict';

const mongoose = require('mongoose');

const bottleneckSchema = new mongoose.Schema(
  {
    planningDate: { type: Date, required: true },
    operationType: { type: String, required: true },
    operationalArea: { type: String, required: true },
    workload: { type: Number, required: true, min: 0 },
    availableWorkforce: { type: Number, required: true, min: 0 },
    requiredWorkforce: { type: Number, required: true, min: 0 },
    capacityGap: { type: Number, required: true },
    utilization: { type: Number, required: true, min: 0 },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      required: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'RESOLVED'],
      required: true,
      default: 'OPEN',
    },
    reason: { type: String, required: true },
  },
  { timestamps: true }
);

bottleneckSchema.index({ planningDate: 1, operationalArea: 1 });
bottleneckSchema.index({ severity: 1, status: 1 });

module.exports = mongoose.model('Bottleneck', bottleneckSchema);
