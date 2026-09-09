import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

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

  const handleUpdateStatus = async (rec, newStatus) => {
    const id = rec._id;
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    setFeedback(null);

    try {
      const res = await api.updateRecommendation(id, newStatus);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Successfully reallocated +${rec.recommendedResources} worker(s) from ${rec.sourceArea} to ${rec.targetArea}. Workforce capacity updated across all pages.`,
        });
        await fetchRecs();
      }
    } catch (err) {
      console.error('Update status error:', err);
      const errMsg = err?.response?.data?.error?.message || err?.message || 'Failed to apply workforce recommendation.';
      setFeedback({
        type: 'error',
        message: errMsg,
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
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

      {feedback && (
        <div
          style={{
            padding: '1rem 1.2rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '500',
            fontSize: '14px',
            backgroundColor: feedback.type === 'success' ? '#E8F5E9' : '#FFEBEE',
            color: feedback.type === 'success' ? '#2E7D32' : '#C62828',
            border: `1px solid ${feedback.type === 'success' ? '#C8E6C9' : '#FFCDD2'}`,
          }}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="ups-card">
        <div className="ups-card-header">
          <h2 className="card-heading">Recommended Operational Actions ({recommendations.length} Manifests)</h2>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Loading recommendations...</div>
        ) : recommendations.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#2F855A', fontWeight: '500' }}>
            ✓ No pending recommendations. All operational areas are balanced.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {recommendations.map((rec) => {
              const isAccepted = rec.status === 'ACCEPTED' || rec.status === 'COMPLETED';
              const isExecuting = actionLoading[rec._id];

              return (
                <div
                  key={rec._id}
                  style={{
                    padding: '1.2rem',
                    backgroundColor: isAccepted ? '#FAFAFA' : '#FFFDF5',
                    border: `1px solid ${isAccepted ? '#E0E0E0' : '#FFE082'}`,
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
                    <span>Status: <strong style={{ color: isAccepted ? '#2E7D32' : '#D97706' }}>{rec.status}</strong></span>
                  </div>

                  {isAccepted ? (
                    <div style={{ padding: '10px 16px', backgroundColor: '#E8F5E9', border: '1px solid #C8E6C9', color: '#2E7D32', borderRadius: '4px', fontWeight: '500', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} /> Recommendation Executed &amp; Reallocated (+{rec.recommendedResources} Sorters)
                    </div>
                  ) : (
                    <button
                      className="btn-ups-primary"
                      disabled={isExecuting}
                      onClick={() => handleUpdateStatus(rec, 'ACCEPTED')}
                    >
                      {isExecuting ? 'Applying Reallocation...' : 'Accept Recommendation →'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
