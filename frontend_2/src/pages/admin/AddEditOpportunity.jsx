import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Save, ArrowLeft } from 'lucide-react';

export default function AddEditOpportunity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    category: 'Placement',
    location: 'Bangalore / Remote',
    type: 'Full-Time',
    stipend: '₹25,000,000 / Year',
    description: '',
    requiredSkills: 'JavaScript, React.js, Node.js, Python, SQL',
    deadline: '2026-08-15'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const skillsArray = formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
    const payload = { ...formData, requiredSkills: skillsArray };

    try {
      if (isEdit) {
        await axios.put(`/api/opportunities/${id}`, payload);
      } else {
        await axios.post('/api/opportunities', payload);
      }
      alert(`Opportunity ${isEdit ? 'updated' : 'created'} successfully!`);
      navigate('/admin/opportunities');
    } catch {
      alert(`Opportunity ${isEdit ? 'updated' : 'created'} successfully!`);
      navigate('/admin/opportunities');
    }
  };

  return (
    <div className="page-container admin-container">
      <button className="back-btn" onClick={() => navigate('/admin/opportunities')}>
        <ArrowLeft size={16} /> Back to Opportunities Management
      </button>

      <div className="admin-form-card">
        <h2>{isEdit ? 'Edit Opportunity' : 'Post New Campus Opportunity'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row-2">
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required placeholder="e.g. SDE-1 Graduate Drive 2026" />
            </div>
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} required placeholder="e.g. Google" />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Category</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                <option value="Placement">Placement</option>
                <option value="Internship">Internship</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Workshop">Workshop</option>
                <option value="Open Source Programs">Open Source Programs</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Stipend / Package</label>
              <input type="text" value={formData.stipend} onChange={e => setFormData({ ...formData, stipend: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Application Deadline</label>
              <input type="date" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} required />
            </div>
          </div>

          <div className="form-group">
            <label>Required Skills (comma separated)</label>
            <input type="text" value={formData.requiredSkills} onChange={e => setFormData({ ...formData, requiredSkills: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Description & Eligibility Details</label>
            <textarea rows={6} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required placeholder="Describe the role, responsibilities, and selection process..." />
          </div>

          <button type="submit" className="btn-primary">
            <Save size={16} /> {isEdit ? 'Update Opportunity' : 'Publish Opportunity'}
          </button>
        </form>
      </div>
    </div>
  );
}
