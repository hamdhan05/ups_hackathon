import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, MapPin, Activity, ArrowRight, AlertTriangle, CheckCircle2, ChevronRight, Layers } from 'lucide-react';

const LOGISTICS_CATEGORIES = ['All Facilities', 'Air Hubs', 'Regional Sort Centers', 'Ground Freight Depots', 'Last-Mile Delivery'];

const MOCK_FACILITIES = [
  {
    _id: 'opp_1',
    title: 'Louisville SDF Worldport Air Hub',
    code: 'SDF-AIR-01',
    category: 'Air Hubs',
    location: 'Louisville, KY',
    capacity: '142,500 Pkgs/Day',
    utilization: 109,
    status: 'CAPACITY WARNING',
    shiftCoverage: '93%',
    skills: ['Air Gateway', 'High-Speed Automated Sort', 'Customs Clearance', 'Cold Chain']
  },
  {
    _id: 'opp_2',
    title: 'Chicago ORD Regional Sort Facility',
    code: 'ORD-SORT-04',
    category: 'Regional Sort Centers',
    location: 'Chicago, IL',
    capacity: '118,000 Pkgs/Day',
    utilization: 88,
    status: 'OPTIMIZED',
    shiftCoverage: '98%',
    skills: ['Intermodal Rail', 'Cross-Docking', 'Matrix Sorting', 'Trailer Staging']
  },
  {
    _id: 'opp_3',
    title: 'Dallas DFW Global Logistics Park',
    code: 'DFW-DIST-02',
    category: 'Ground Freight Depots',
    location: 'Dallas, TX',
    capacity: '95,000 Pkgs/Day',
    utilization: 94,
    status: 'ON SCHEDULE',
    shiftCoverage: '95%',
    skills: ['Ground Heavy Freight', 'Hazardous Cargo', 'Overnight Linehaul']
  },
  {
    _id: 'opp_4',
    title: 'Atlanta ATL Gateway & Depots',
    code: 'ATL-HUB-09',
    category: 'Air Hubs',
    location: 'Atlanta, GA',
    capacity: '135,000 Pkgs/Day',
    utilization: 79,
    status: 'OPTIMIZED',
    shiftCoverage: '100%',
    skills: ['Express Air Next Day', 'Regional Feeders', 'Sort Automation']
  },
  {
    _id: 'opp_5',
    title: 'Newark EWR Air Sorting Station',
    code: 'EWR-AIR-03',
    category: 'Air Hubs',
    location: 'Newark, NJ',
    capacity: '88,000 Pkgs/Day',
    utilization: 97,
    status: 'ATTENTION REQUIRED',
    shiftCoverage: '91%',
    skills: ['International Customs', 'High-Density Postal', 'Flight Linehaul']
  },
  {
    _id: 'opp_6',
    title: 'Ontario ONT Logistics Hub',
    code: 'ONT-DIST-05',
    category: 'Last-Mile Delivery',
    location: 'Ontario, CA',
    capacity: '102,000 Pkgs/Day',
    utilization: 84,
    status: 'OPTIMIZED',
    shiftCoverage: '96%',
    skills: ['Urban Delivery Fleet', 'EV Dispatch', 'Same-Day Expedited']
  }
];

export default function Opportunities() {
  const [category, setCategory] = useState('All Facilities');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredFacilities = MOCK_FACILITIES.filter(fac => {
    const matchesCat = category === 'All Facilities' || fac.category === category;
    const matchesSearch = fac.title.toLowerCase().includes(search.toLowerCase()) ||
                          fac.location.toLowerCase().includes(search.toLowerCase()) ||
                          fac.code.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="facilities-container">
      {/* PAGE HEADER WITH UPS YELLOW ACCENT UNDERLINE */}
      <div className="page-header-block">
        <h1 className="page-title">Workload & Capacity Management</h1>
        <div className="heading-accent-line"></div>
        <p className="page-subtitle">
          Monitor package volume manifests, throughput capacity utilization, and shift staffing across LogiPulse global logistics network.
        </p>
      </div>

      {/* FILTER BAR (UPS STYLE) */}
      <div className="ups-card ups-card-yellow-top" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '1.5rem', alignItems: 'center' }}>
          <div className="filter-field-group">
            <label>Search Hub or Facility Code</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="ups-input"
                placeholder="Search by hub name, code (e.g. SDF-AIR-01), or location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-field-group">
            <label>Facility Category</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {LOGISTICS_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={category === cat ? 'btn-ups-primary' : 'btn-ups-outline'}
                  style={{ height: '36px', fontSize: '0.8rem', padding: '0 0.8rem' }}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FACILITIES GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {filteredFacilities.map(fac => {
          const isWarning = fac.utilization > 100;
          return (
            <div
              key={fac._id}
              className={`ups-card ${isWarning ? 'ups-card-yellow-top' : 'ups-card-accent-top'}`}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              onClick={() => navigate(`/opportunities/${fac._id}`)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '900', color: '#666', textTransform: 'uppercase' }}>
                    {fac.code} • {fac.category}
                  </span>
                  <span className={`ups-badge ${isWarning ? 'badge-yellow' : 'badge-green'}`}>
                    {fac.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#351c15', marginBottom: '4px' }}>
                  {fac.title}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color="#0066cc" /> {fac.location}
                </div>

                <div style={{ backgroundColor: '#fafafa', padding: '0.8rem', borderRadius: '4px', border: '1px solid #e5e5e5', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '700', color: '#351c15' }}>Capacity Utilization</span>
                    <span style={{ fontWeight: '900', color: isWarning ? '#d97706' : '#2e7d32' }}>{fac.utilization}%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e5e5e5', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, fac.utilization)}%`,
                        backgroundColor: isWarning ? '#ffb500' : '#2e7d32'
                      }}
                    ></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#666', marginTop: '6px' }}>
                    <span>Volume: {fac.capacity}</span>
                    <span>Staffing: {fac.shiftCoverage}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '1rem' }}>
                  {fac.skills.map((sk, idx) => (
                    <span key={idx} style={{ backgroundColor: '#e6f0fa', color: '#0066cc', fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '3px' }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="link-ups-blue" style={{ fontSize: '0.85rem' }}>
                  Inspect Facility Manifest
                </span>
                <ChevronRight size={16} color="#0066cc" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
