import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ForecastPage() {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForecasts() {
      try {
        const res = await api.getForecast();
        if (res.success) {
          setForecasts(res.data.items || []);
        }
      } catch (err) {
        console.error('Forecast fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchForecasts();
  }, []);

  // Format data for Recharts by date
  const chartMap = {};
  for (const f of forecasts) {
    const dStr = new Date(f.forecastDate).toISOString().split('T')[0];
    if (!chartMap[dStr]) chartMap[dStr] = { date: dStr };
    chartMap[dStr][f.operationalArea] = f.forecastedVolume;
  }
  const chartData = Object.values(chartMap);

  const totalForecastVolume = forecasts.reduce((acc, f) => acc + (f.forecastedVolume || 0), 0);
  const avgConfidence = forecasts.length
    ? Math.round(forecasts.reduce((acc, f) => acc + (f.confidence || 0), 0) / forecasts.length)
    : 0;

  return (
    <div className="forecast-page">
      <div className="page-header-block">
        <h1 className="page-title">Forecast</h1>
        <div className="heading-accent-line"></div>
        <p className="page-subtitle">
          Predictive package volume modeling, day peak volume forecasts, and seasonal logistics trends.
        </p>
      </div>

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">7-Day Total Forecasted Volume</div>
          <div className="kpi-number">{totalForecastVolume.toLocaleString()}</div>
          <div className="kpi-unit">expected packages (Multiple Linear Regression)</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Model Confidence Score</div>
          <div className="kpi-number">{avgConfidence}%</div>
          <div className="kpi-unit">derived from chronological backtesting MAPE</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Forecast Model & Horizon</div>
          <div className="kpi-number">LinearRegression</div>
          <div className="kpi-unit">7-day OLS autoregressive rolling projection</div>
        </div>
      </div>

      {/* FORECAST CHART */}
      <div className="ups-card" style={{ marginBottom: '2rem' }}>
        <div className="ups-card-header">
          <h2 className="card-heading">7-Day Area Volume Forecast Lines</h2>
        </div>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#FAF9F8', borderColor: '#D9D7D3', color: '#330000' }} />
              <Legend wrapperStyle={{ color: '#330000' }} />
              <Line type="monotone" dataKey="Shipping" stroke="#351C15" strokeWidth={3} />
              <Line type="monotone" dataKey="Picking" stroke="#D97706" strokeWidth={2} />
              <Line type="monotone" dataKey="Packing" stroke="#0667B9" strokeWidth={2} />
              <Line type="monotone" dataKey="Receiving" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FORECAST TABLE */}
      <div className="ups-card">
        <div className="ups-card-header">
          <h2 className="card-heading">Forecast Details Table</h2>
        </div>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Loading forecasts...</div>
        ) : (
          <div className="ups-table-container">
            <table className="ups-table">
              <thead>
                <tr>
                  <th>Forecast Date</th>
                  <th>Operational Area</th>
                  <th>Type</th>
                  <th>Forecasted Volume</th>
                  <th>Model Name</th>
                </tr>
              </thead>
              <tbody>
                {forecasts.map((f) => (
                  <tr key={f._id}>
                    <td>{new Date(f.forecastDate).toISOString().split('T')[0]}</td>
                    <td style={{ fontWeight: '600', color: '#330000' }}>{f.operationalArea}</td>
                    <td>{f.operationType}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>{f.forecastedVolume?.toLocaleString()}</td>
                    <td>{f.modelName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
