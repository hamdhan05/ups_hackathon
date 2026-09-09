import React, { useState } from 'react';
import { api } from '../services/api';

interface RecommendationItem {
  _id: string;
  sourceArea: string;
  targetArea: string;
  operationType: string;
  recommendedResources: number;
  sourceAvailableCapacity: number;
  targetCapacityGap: number;
  reason: string;
  priority: string;
  expectedImpact: string;
  status: string;
}

interface RecommendationsTableProps {
  recommendations: RecommendationItem[];
  onStatusUpdate?: () => void;
}

const priorityStyles = {
  CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/30',
  HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  MEDIUM: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  LOW: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const statusStyles = {
  PENDING: 'bg-amber-500/20 text-amber-300',
  ACCEPTED: 'bg-emerald-500/20 text-emerald-300',
  REJECTED: 'bg-red-500/20 text-red-300',
  COMPLETED: 'bg-blue-500/20 text-blue-300',
};

export default function RecommendationsTable({ recommendations, onStatusUpdate }: RecommendationsTableProps) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdating(id);
    setError('');
    try {
      await api.updateRecommendation(id, newStatus);
      onStatusUpdate?.();
    } catch {
      setError('Failed to update recommendation status');
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Resource Allocation Recommendations</h3>
        <span className="text-xs text-slate-400">{recommendations.length} total</span>
      </div>

      {error && (
        <div className="mb-3 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">{error}</div>
      )}

      {recommendations.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-sm">No recommendations available</div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec._id}
              className="border border-slate-700/50 rounded-lg p-4 bg-slate-900/40 hover:border-slate-600/50 transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-blue-400">{rec.sourceArea}</span>
                  <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span className="text-sm font-bold text-red-400">{rec.targetArea}</span>
                  <span className="text-xs text-slate-500">· {rec.operationType}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded border ${priorityStyles[rec.priority as keyof typeof priorityStyles] || priorityStyles.LOW}`}>
                    {rec.priority}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusStyles[rec.status as keyof typeof statusStyles] || ''}`}>
                    {rec.status}
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-slate-800/60 rounded-lg px-3 py-2">
                  <p className="text-xs text-slate-500">Redistribute</p>
                  <p className="text-lg font-bold text-amber-400">{rec.recommendedResources}</p>
                  <p className="text-xs text-slate-500">workers</p>
                </div>
                <div className="bg-slate-800/60 rounded-lg px-3 py-2">
                  <p className="text-xs text-slate-500">Source Excess</p>
                  <p className="text-lg font-bold text-emerald-400">+{rec.sourceAvailableCapacity}</p>
                  <p className="text-xs text-slate-500">available</p>
                </div>
                <div className="bg-slate-800/60 rounded-lg px-3 py-2">
                  <p className="text-xs text-slate-500">Target Gap</p>
                  <p className="text-lg font-bold text-red-400">{rec.targetCapacityGap}</p>
                  <p className="text-xs text-slate-500">shortage</p>
                </div>
              </div>

              {/* Reason */}
              <p className="text-xs text-slate-400 leading-relaxed mb-2">{rec.reason}</p>
              {rec.expectedImpact && (
                <p className="text-xs text-blue-400/70 leading-relaxed mb-3">💡 {rec.expectedImpact}</p>
              )}

              {/* Actions */}
              {rec.status === 'PENDING' && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700/50">
                  <button
                    id={`accept-${rec._id}`}
                    disabled={updating === rec._id}
                    onClick={() => handleStatusChange(rec._id, 'ACCEPTED')}
                    className="flex-1 py-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30
                      hover:bg-emerald-500/30 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {updating === rec._id ? '...' : '✓ Accept'}
                  </button>
                  <button
                    id={`reject-${rec._id}`}
                    disabled={updating === rec._id}
                    onClick={() => handleStatusChange(rec._id, 'REJECTED')}
                    className="flex-1 py-1.5 text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30
                      hover:bg-red-500/30 rounded-lg transition-colors disabled:opacity-50"
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
              {rec.status === 'ACCEPTED' && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700/50">
                  <button
                    disabled={updating === rec._id}
                    onClick={() => handleStatusChange(rec._id, 'COMPLETED')}
                    className="flex-1 py-1.5 text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30
                      hover:bg-blue-500/30 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Mark Completed
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
