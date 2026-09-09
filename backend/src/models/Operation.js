'use strict';

const mongoose = require('mongoose');

const operationSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    operationType: {
      type: String,
      enum: ['INBOUND', 'OUTBOUND', 'INVENTORY'],
      required: true,
    },
    operationalArea: {
      type: String,
      enum: ['Receiving', 'Putaway', 'Picking', 'Packing', 'Shipping', 'Inventory'],
      required: true,
    },
    workload: { type: Number, required: true, min: 0 },
    plannedWorkload: { type: Number, min: 0 },
    completedWorkload: { type: Number, min: 0 },
    processingCapacity: { type: Number, min: 0 },
    availableWorkforce: { type: Number, min: 0 },
    requiredWorkforce: { type: Number, min: 0 },
    processingTime: { type: Number, min: 0 },
    delayRate: { type: Number, min: 0, max: 100 },
    efficiency: { type: Number, min: 0 },
    utilization: { type: Number, min: 0 },
    status: {
      type: String,
      enum: ['NORMAL', 'DELAYED', 'AT_RISK', 'COMPLETED'],
      default: 'NORMAL',
    },
  },
  { timestamps: true }
);

operationSchema.index({ date: 1 });
operationSchema.index({ operationType: 1, date: 1 });
operationSchema.index({ operationalArea: 1, date: 1 });

module.exports = mongoose.model('Operation', operationSchema);
