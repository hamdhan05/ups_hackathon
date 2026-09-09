'use strict';

const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    recommendationDate: { type: Date, required: true },
    sourceArea: { type: String, required: true },
    targetArea: { type: String, required: true },
    operationType: { type: String, required: true },
    recommendedResources: { type: Number, required: true, min: 0 },
    sourceAvailableCapacity: { type: Number },
    targetCapacityGap: { type: Number },
    reason: { type: String, required: true },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      required: true,
    },
    expectedImpact: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'],
      required: true,
      default: 'PENDING',
    },
    bottleneckReference: { type: mongoose.Schema.Types.ObjectId, ref: 'Bottleneck' },
    capacityReference: { type: mongoose.Schema.Types.ObjectId, ref: 'Capacity' },
  },
  { timestamps: true }
);

recommendationSchema.index({ recommendationDate: 1 });
recommendationSchema.index({ status: 1, priority: 1 });
recommendationSchema.index({ targetArea: 1, recommendationDate: 1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);
