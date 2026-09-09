import React, { useState } from 'react';
import { Tag, Building2, Plus, Trash2 } from 'lucide-react';

export default function CategoryCompanyManagement() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Placement', count: 28, color: '#6366f1' },
    { id: 2, name: 'Internship', count: 20, color: '#8b5cf6' },
    { id: 3, name: 'Hackathon', count: 8, color: '#ec4899' },
    { id: 4, name: 'Scholarship', count: 6, color: '#f59e0b' }
  ]);

  const [companies, setCompanies] = useState([
    { id: 1, name: 'Google', industry: 'Technology', size: '100k+', activeOpp: 12 },
    { id: 2, name: 'Microsoft', industry: 'Software', size: '200k+', activeOpp: 10 },
    { id: 3, name: 'Meta', industry: 'AI & Social', size: '80k+', activeOpp: 8 }
  ]);

  const [newCat, setNewCat] = useState('');
  const [newCo, setNewCo] = useState('');

  const addCategory = () => {
    if (!newCat) return;
    setCategories([...categories, { id: Date.now(), name: newCat, count: 0, color: '#6366f1' }]);
    setNewCat('');
  };

  const addCompany = () => {
    if (!newCo) return;
    setCompanies([...companies, { id: Date.now(), name: newCo, industry: 'Technology', size: '1k+', activeOpp: 0 }]);
    setNewCo('');
  };

  return (
    <div className="page-container admin-container">
      <div className="page-header admin-header">
        <div>
          <h2>Category & Company Management</h2>
          <p>Organize opportunity categories and corporate recruiters on the platform.</p>
        </div>
      </div>

      <div className="admin-grid-2">
        {/* Categories */}
        <div className="admin-card">
          <h3><Tag size={18} /> Categories</h3>
          <div className="add-inline-row">
            <input type="text" placeholder="New Category Name..." value={newCat} onChange={e => setNewCat(e.target.value)} />
            <button className="btn-primary" onClick={addCategory}><Plus size={14} /> Add</button>
          </div>

          <div className="categories-list-box">
            {categories.map(c => (
              <div key={c.id} className="category-item-row">
                <span>{c.name} ({c.count} active)</span>
                <button className="btn-del-sm" onClick={() => setCategories(categories.filter(cat => cat.id !== c.id))}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Companies */}
        <div className="admin-card">
          <h3><Building2 size={18} /> Partner Companies</h3>
          <div className="add-inline-row">
            <input type="text" placeholder="Company Name..." value={newCo} onChange={e => setNewCo(e.target.value)} />
            <button className="btn-primary" onClick={addCompany}><Plus size={14} /> Add</button>
          </div>

          <div className="categories-list-box">
            {companies.map(co => (
              <div key={co.id} className="category-item-row">
                <span><strong>{co.name}</strong> — {co.industry}</span>
                <button className="btn-del-sm" onClick={() => setCompanies(companies.filter(c => c.id !== co.id))}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
