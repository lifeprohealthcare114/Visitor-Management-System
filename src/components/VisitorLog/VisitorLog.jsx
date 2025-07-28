import React, { useState, useEffect } from 'react';
import ExportButton from '../ExportButton/ExportButton';
import './VisitorLog.css';

function VisitorLog() {
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    // // Old localStorage logic:
    // const loadVisitors = () => {
    //   const storedData = localStorage.getItem('visitorRegistrations');
    //   if (storedData) {
    //     setVisitors(JSON.parse(storedData));
    //   }
    // };
    // loadVisitors();
    // window.addEventListener('storage', loadVisitors);
    // return () => {
    //   window.removeEventListener('storage', loadVisitors);
    // };

    // New: fetch from backend API
    const loadVisitors = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/visitors");
        if (!response.ok) throw new Error("Failed to fetch visitors");
        const data = await response.json();
        setVisitors(data);
      } catch (err) {
        setVisitors([]);
      }
    };
    loadVisitors();
  }, []);

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch =
      `${visitor.firstName} ${visitor.lastName} ${visitor.companyName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesDate =
      filterDate === '' ||
      (visitor.registrationDate && new Date(visitor.registrationDate).toLocaleDateString()
        === new Date(filterDate).toLocaleDateString());

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
              <th>Email</th>
              <th>Designation</th>         
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
                  <td>{visitor.email || '-'}</td>
                  <td>{visitor.designation || '-'}</td>
                  <td>{visitor.registrationDate ? new Date(visitor.registrationDate).toLocaleString() : '-'}</td>
                  <td>{visitor.purpose || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
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
