import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, FileText, CheckCircle2, XCircle, Eye } from 'lucide-react';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`/api/admin/students?search=${search}`);
        if (res.data.success) setStudents(res.data.students);
      } catch {
        setStudents([
          { _id: 's_1', name: 'Alex Mercer', email: 'alex.mercer@stanford.edu', department: 'CSE', year: '2026', cgpa: 8.9, targetRole: 'Full Stack Engineer', resumeUrl: '/uploads/resume_alex.pdf', resumeAtsScore: 84, applicationsCount: 8 },
          { _id: 's_2', name: 'Sophia Chen', email: 'sophia.chen@stanford.edu', department: 'IT', year: '2026', cgpa: 9.2, targetRole: 'AI / Data Science Engineer', resumeUrl: '/uploads/resume_sophia.pdf', resumeAtsScore: 91, applicationsCount: 12 },
          { _id: 's_3', name: 'Marcus Vance', email: 'marcus.vance@stanford.edu', department: 'ECE', year: '2026', cgpa: 8.4, targetRole: 'Embedded Engineer', resumeUrl: '', resumeAtsScore: 0, applicationsCount: 5 }
        ]);
      }
    };
    fetchStudents();
  }, [search]);

  return (
    <div className="page-container admin-container">
      <div className="page-header admin-header">
        <div>
          <h2>Student Management</h2>
          <p>Monitor student progress, verified resume uploads, ATS scores, and applications.</p>
        </div>
      </div>

      <div className="admin-search-row">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search by student name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Department</th>
              <th>CGPA</th>
              <th>Target Role</th>
              <th>Resume Status</th>
              <th>ATS Score</th>
              <th>Applications</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id}>
                <td>
                  <div className="table-user-cell">
                    <div className="avatar-xs">{s.name?.[0]}</div>
                    <div>
                      <div className="user-name">{s.name}</div>
                      <div className="user-email">{s.email}</div>
                    </div>
                  </div>
                </td>
                <td>{s.department}</td>
                <td>{s.cgpa}</td>
                <td>{s.targetRole}</td>
                <td>
                  {s.resumeUrl ? (
                    <span className="badge-status status-success"><CheckCircle2 size={12} /> Uploaded</span>
                  ) : (
                    <span className="badge-status status-danger"><XCircle size={12} /> Missing</span>
                  )}
                </td>
                <td>{s.resumeAtsScore ? `${s.resumeAtsScore}/100` : 'N/A'}</td>
                <td>{s.applicationsCount || 0}</td>
                <td>
                  <button className="btn-action-sm" onClick={() => alert(`Student Details for ${s.name}\nEmail: ${s.email}\nCGPA: ${s.cgpa}`)}>
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
