import React, { useState } from 'react';
import { Megaphone, Send, Pin, Trash2 } from 'lucide-react';

export default function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Google & Microsoft Campus Placement Drive 2026 Registration Open', content: 'All final year CSE, IT, and ECE students with CGPA >= 7.5 must upload their updated resume before July 30th.', category: 'Placement Drive', pinned: true },
    { id: 2, title: 'Mandatory AWS & Cloud Architecture Bootcamp', content: 'Free 3-day weekend workshop starting Saturday. Registered students receive certification vouchers.', category: 'Workshop', pinned: false }
  ]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const createAnn = () => {
    if (!title || !content) return;
    setAnnouncements([{ id: Date.now(), title, content, category: 'Placement Drive', pinned: false }, ...announcements]);
    setTitle(''); setContent('');
  };

  return (
    <div className="page-container admin-container">
      <div className="page-header admin-header">
        <div>
          <h2>Announcement Broadcast Center</h2>
          <p>Post official announcements, placement alerts, and drive updates to all students.</p>
        </div>
      </div>

      <div className="admin-grid-layout">
        <div className="admin-card">
          <h3>Create Announcement</h3>
          <input type="text" placeholder="Announcement Title..." value={title} onChange={e => setTitle(e.target.value)} />
          <textarea rows={4} placeholder="Announcement details..." value={content} onChange={e => setContent(e.target.value)} />
          <button className="btn-primary" onClick={createAnn}><Send size={14} /> Broadcast Announcement</button>
        </div>

        <div className="admin-card">
          <h3>Active Broadcasts</h3>
          <div className="ann-list">
            {announcements.map(a => (
              <div key={a.id} className="ann-item">
                <div className="ann-header">
                  <h4>{a.pinned && <Pin size={14} className="icon-indigo" />} {a.title}</h4>
                  <button className="btn-del-sm" onClick={() => setAnnouncements(announcements.filter(item => item.id !== a.id))}><Trash2 size={14} /></button>
                </div>
                <p>{a.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
