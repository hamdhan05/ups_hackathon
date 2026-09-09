import React, { useState } from 'react';
import { Users, MessageSquare, ThumbsUp, Send, Building2 } from 'lucide-react';

const INITIAL_LOGS = [
  {
    _id: 'disc_1',
    title: 'SDF Air Gateway PM Shift Handover Log',
    content: 'All 48,200 air express packages processed clean. Sort Belt 2 diverts active. Intermodal rail feeder 410 departing at 19:30 on schedule.',
    authorName: 'Marcus Vance (Ops Mgr)',
    facility: 'SDF-AIR-01',
    likes: 12
  },
  {
    _id: 'disc_2',
    title: 'ORD Regional Sort Weather Delay Advisory',
    content: 'Heavy thunderstorm warning over Chicago airspace. 3 incoming feeder flights rerouted to SDF & CVG. Prepare ground dock doors 10-15.',
    authorName: 'Sarah Jenkins (Ops Dir)',
    facility: 'ORD-SORT-04',
    likes: 24
  }
];

export default function CommunityMentorship() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handlePostLog = (e) => {
    e.preventDefault();
    if (!title || !content) return;
    setLogs([
      {
        _id: `disc_${Date.now()}`,
        title,
        content,
        authorName: 'Marcus Vance (Ops Mgr)',
        facility: 'SDF-AIR-01',
        likes: 0
      },
      ...logs
    ]);
    setTitle('');
    setContent('');
  };

  return (
    <div className="dispatch-network-container">
      {/* PAGE HEADER WITH UPS YELLOW ACCENT UNDERLINE */}
      <div className="page-header-block">
        <h1 className="page-title">Manager Dispatch & Hub Network</h1>
        <div className="heading-accent-line"></div>
        <p className="page-subtitle">
          Inter-facility dispatch communications, shift handover logs, network weather advisories, and manager dispatch notes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* CREATE DISPATCH LOG */}
        <div className="ups-card ups-card-yellow-top">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#351c15', marginBottom: '1rem' }}>
            Submit Shift Handover Log
          </h3>

          <form onSubmit={handlePostLog} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="filter-field-group">
              <label>Log Header / Title</label>
              <input
                type="text"
                className="ups-input"
                placeholder="e.g. SDF Day Shift Handover Notes"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div className="filter-field-group">
              <label>Operational Handover Details</label>
              <textarea
                rows={4}
                className="ups-input"
                style={{ height: 'auto', padding: '0.8rem' }}
                placeholder="Record volume throughput, sorter issues, or dispatch notes..."
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-ups-primary">
              <Send size={16} /> BROADCAST HANDOVER LOG
            </button>
          </form>
        </div>

        {/* LOGS FEED */}
        <div className="ups-card ups-card-accent-top">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#351c15', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="#ffb500" /> Active Network Dispatch Logs
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {logs.map(l => (
              <div
                key={l._id}
                style={{
                  padding: '1rem',
                  border: '1px solid #d8d8d8',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  borderLeft: '4px solid #351c15'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#351c15' }}>{l.title}</span>
                  <span className="ups-badge badge-blue">{l.facility}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#444', marginBottom: '8px' }}>{l.content}</p>
                <div style={{ fontSize: '0.78rem', color: '#888' }}>Author: {l.authorName}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
