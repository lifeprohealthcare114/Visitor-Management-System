import React, { useState, useEffect } from 'react';
import ExportButton from '../ExportButton/ExportButton';
import './VisitorLog.css';

function VisitorLog() {
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(false);

  // Load visitors from localStorage instead of backend API
  const loadVisitors = () => {
    setLoading(true);
    try {
      const storedVisitors = JSON.parse(localStorage.getItem('visitorRegistrations')) || [];
      setVisitors(storedVisitors);
    } catch (err) {
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();

    // Listen for localStorage changes in other tabs/windows
    const handleStorageChange = (event) => {
      if (event.key === 'visitorRegistrations') {
        loadVisitors();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Delete visitor from localStorage and update state
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this visitor?')) return;

    setLoading(true);
    try {
      const storedVisitors = JSON.parse(localStorage.getItem('visitorRegistrations')) || [];
      const updatedVisitors = storedVisitors.filter(visitor => visitor.id !== id);
      localStorage.setItem('visitorRegistrations', JSON.stringify(updatedVisitors));
      setVisitors(updatedVisitors);
    } catch (err) {
      alert('Failed to delete visitor');
    } finally {
      setLoading(false);
    }
  };

  /*
  // Original backend API call — commented out as per request
  useEffect(() => {
    const fetchVisitors = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/visitors");
        if (!response.ok) throw new Error("Failed to fetch visitors");
        const data = await response.json();
        setVisitors(data);
      } catch {
        setVisitors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVisitors();
  }, []);
  */

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch =
      `${visitor.firstName} ${visitor.lastName} ${visitor.companyName || ''}`.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDate =
      filterDate === '' ||
      (visitor.registrationDate && new Date(visitor.registrationDate).toLocaleDateString() === new Date(filterDate).toLocaleDateString());

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
              <th>Actions</th> {/* New column for Delete */}
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
                  <td>
                    <button
                      onClick={() => handleDelete(visitor.id)}
                      disabled={loading}
                      className="delete-button"
                      aria-label={`Delete visitor ${visitor.firstName} ${visitor.lastName}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
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
