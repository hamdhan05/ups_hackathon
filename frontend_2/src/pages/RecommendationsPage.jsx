import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { CheckCircle2 } from 'lucide-react';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getRecommendations();
      if (res.success) {
        setRecommendations(res.data.items || []);
      }
    } catch (err) {
      console.error('Recommendations fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecs();
  }, [fetchRecs]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.updateRecommendation(id, newStatus);
      if (res.success) {
        fetchRecs();
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  return (
    <div className="recommendations-page">
      <div className="page-header-block">
        <h1 className="page-title">Recommendations</h1>
        <div className="heading-accent-line"></div>
        <p className="page-subtitle">
          AI automated package flow rerouting plans, flex labor allocation triggers, and proactive operational recommendations.
        </p>
      </div>

      <div className="ups-card">
        <div className="ups-card-header">
          <h2 className="card-heading">Recommended Operational Actions ({recommendations.length} Manifests)</h2>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Loading recommendations...</div>
        ) : recommendations.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>No recommendations pending.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {recommendations.map((rec) => (
              <div
                key={rec._id}
                style={{
                  padding: '1.2rem',
                  backgroundColor: '#FFFDF5',
                  border: '1px solid #FFE082',
                  borderRadius: '6px',
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#330000', marginBottom: '6px' }}>
                  Reallocate +{rec.recommendedResources} Worker(s) from {rec.sourceArea} to {rec.targetArea}
                </div>
                <p className="body-text" style={{ marginBottom: '1rem' }}>
                  {rec.reason}
                </p>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '14px', color: '#555555', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                  <span>Source Area: <strong>{rec.sourceArea}</strong></span>
                  <span>Target Area: <strong>{rec.targetArea}</strong></span>
                  <span>Priority: <strong>{rec.priority}</strong></span>
                  <span>Status: <strong>{rec.status}</strong></span>
                </div>

                {rec.status === 'ACCEPTED' || rec.status === 'COMPLETED' ? (
                  <div style={{ padding: '10px 16px', backgroundColor: '#E8F5E9', border: '1px solid #C8E6C9', color: '#2E7D32', borderRadius: '4px', fontWeight: '500', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> Recommendation Executed &amp; Reallocated
                  </div>
                ) : (
                  <button
                    className="btn-ups-primary"
                    onClick={() => handleUpdateStatus(rec._id, 'ACCEPTED')}
                  >
                    Accept Recommendation →
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
