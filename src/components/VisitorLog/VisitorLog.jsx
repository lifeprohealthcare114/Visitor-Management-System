import React, { useState, useEffect } from 'react';
import ExportButton from '../ExportButton/ExportButton';
import './VisitorLog.css';

function VisitorLog() {
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const loadVisitors = () => {
      const storedData = localStorage.getItem('visitorRegistrations');
      if (storedData) {
        setVisitors(JSON.parse(storedData));
      }
    };
    
    loadVisitors();
    window.addEventListener('storage', loadVisitors);
    
    return () => {
      window.removeEventListener('storage', loadVisitors);
    };
  }, []);

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = 
      `${visitor.firstName} ${visitor.lastName} ${visitor.companyName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    
    const matchesDate = 
      filterDate === '' || 
      new Date(visitor.registrationDate).toLocaleDateString() === 
      new Date(filterDate).toLocaleDateString();
    
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
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="date-filter"
        />
        <ExportButton data={filteredVisitors} />
      </div>

      <div className="visitor-log-table-container">
        <table className="visitor-log-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Phone</th>
              <th>Visit Date</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitors.length > 0 ? (
              filteredVisitors.map(visitor => (
                <tr key={visitor.id}>
                  <td>{visitor.title} {visitor.firstName} {visitor.lastName}</td>
                  <td>{visitor.companyName || '-'}</td>
                  <td>{visitor.phone || '-'}</td>
                  <td>{new Date(visitor.registrationDate).toLocaleString()}</td>
                  <td>{visitor.purpose || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">
                  No visitors found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VisitorLog;