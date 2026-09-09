'use strict';

const mongoose = require('mongoose');

const forecastSchema = new mongoose.Schema(
  {
    forecastDate: { type: Date, required: true },
    operationType: {
      type: String,
      enum: ['INBOUND', 'OUTBOUND', 'INVENTORY'],
      required: true,
    },
    operationalArea: {
      type: String,
      enum: ['Receiving', 'Putaway', 'Picking', 'Packing', 'Shipping', 'Inventory'],
    },
    forecastedVolume: { type: Number, required: true, min: 0 },
    modelName: { type: String, required: true, default: 'LinearRegression' },
    confidence: { type: Number, min: 0, max: 100 },
    validationMAE: { type: Number },
    validationMAPE: { type: Number },
    trendDirection: { type: String, enum: ['INCREASING', 'DECREASING', 'STABLE'] },
    trendPercentage: { type: Number },
    modelVersion: { type: String, default: '2.0' },
  },
  { timestamps: true }
);

forecastSchema.index({ forecastDate: 1, operationType: 1 });
forecastSchema.index({ operationalArea: 1, forecastDate: 1 });

module.exports = mongoose.model('Forecast', forecastSchema);
