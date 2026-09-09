import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Archive, Eye } from 'lucide-react';

export default function OpportunityManagement() {
  const [opportunities, setOpportunities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpp = async () => {
      try {
        const res = await axios.get('/api/opportunities');
        if (res.data.success) setOpportunities(res.data.opportunities);
      } catch {
        setOpportunities([
          { _id: 'opp_1', title: 'Software Development Engineer - Campus Graduate 2026', company: 'Google', category: 'Placement', status: 'Active', applicantsCount: 142, deadline: '2026-08-05' },
          { _id: 'opp_2', title: 'Frontend Developer Intern - Fall 2026', company: 'Microsoft', category: 'Internship', status: 'Active', applicantsCount: 98, deadline: '2026-08-01' },
          { _id: 'opp_3', title: 'Meta Hacker Cup 2026 & AI Hackathon', company: 'Meta', category: 'Hackathon', status: 'Active', applicantsCount: 310, deadline: '2026-08-10' }
        ]);
      }
    };
    fetchOpp();
  }, []);

  const deleteOpp = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
    setOpportunities(prev => prev.filter(o => o._id !== id));
    try { await axios.delete(`/api/opportunities/${id}`); } catch {}
  };

  const archiveOpp = async (id) => {
    setOpportunities(prev => prev.map(o => o._id === id ? { ...o, status: 'Archived' } : o));
    try { await axios.put(`/api/opportunities/${id}/archive`); } catch {}
  };

  return (
    <div className="page-container admin-container">
      <div className="page-header admin-header">
        <div>
          <h2>Opportunity Management (CRUD)</h2>
          <p>Add, edit, delete, and archive opportunities across all categories.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/admin/opportunities/new')}>
          <Plus size={16} /> Add Opportunity
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title & Company</th>
              <th>Category</th>
              <th>Applicants</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map(o => (
              <tr key={o._id}>
                <td>
                  <div className="opp-table-cell">
                    <strong className="cell-title">{o.title}</strong>
                    <span className="cell-sub">{o.company}</span>
                  </div>
                </td>
                <td>{o.category}</td>
                <td>{o.applicantsCount || 0}</td>
                <td>{new Date(o.deadline).toLocaleDateString()}</td>
                <td>
                  <span className={`badge-status ${o.status === 'Active' ? 'status-success' : 'status-warning'}`}>
                    {o.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons-group">
                    <button className="btn-action-icon" title="Edit" onClick={() => navigate(`/admin/opportunities/edit/${o._id}`)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="btn-action-icon icon-warn" title="Archive" onClick={() => archiveOpp(o._id)}>
                      <Archive size={14} />
                    </button>
                    <button className="btn-action-icon icon-danger" title="Delete" onClick={() => deleteOpp(o._id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
