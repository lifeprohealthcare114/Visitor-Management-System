// components/VisitorLog/VisitorLog.jsx
import React, { useState, useEffect } from 'react';
import ExportButton from '../ExportButton/ExportButton';
import './VisitorLog.css';

function VisitorLog() {
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(false);

  const loadVisitors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/getSubmissions');
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error('Expected an array from Netlify Function, got:', data);
        setVisitors([]);
        return;
      }

      const parsedVisitors = data.map(sub => {
        const fields = sub.data || {};
        return {
          id: sub.id,
          title: fields.title || '',
          firstName: fields.firstName || '',
          lastName: fields.lastName || '',
          companyName: fields.companyName || '',
          phone: fields.phone || '',
          email: fields.email || '',
          designation: fields.designation || '',
          registrationDate: sub.created_at || '',
          purpose: fields.purpose || ''
        };
      });

      setVisitors(parsedVisitors);
    } catch (err) {
      console.error('Failed to load Netlify Form submissions', err);
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch =
      `${visitor.firstName} ${visitor.lastName} ${visitor.companyName || ''}`.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesDate =
      filterDate === '' ||
      (visitor.registrationDate &&
        new Date(visitor.registrationDate).toLocaleDateString() ===
          new Date(filterDate).toLocaleDateString());

    return matchesSearch && matchesDate;
  });

  return (
    <div className="visitor-log-container">
      <div className="visitor-log-controls">
        <input
          type="text"
          placeholder="Search by name or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          disabled={loading}
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="date-filter"
          disabled={loading}
        />
        <ExportButton data={filteredVisitors} />
        <button onClick={loadVisitors} disabled={loading} style={{ marginLeft: '10px' }}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="visitor-log-table-container">
        <table className="visitor-log-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Designation</th>
              <th>Visit Date</th>
              <th>Purpose</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitors.length > 0 ? (
              filteredVisitors.map(visitor => (
                <tr key={visitor.id}>
                  <td>{visitor.title} {visitor.firstName} {visitor.lastName}</td>
                  <td>{visitor.companyName || '-'}</td>
                  <td>{visitor.phone || '-'}</td>
                  <td>{visitor.email || '-'}</td>
                  <td>{visitor.designation || '-'}</td>
                  <td>{new Date(visitor.registrationDate).toLocaleString()}</td>
                  <td>{visitor.purpose || '-'}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => alert('Delete disabled in Netlify Form view')}
                      disabled
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">No visitors found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VisitorLog;
