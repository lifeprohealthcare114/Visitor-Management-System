import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import VisitorLog from '../../components/VisitorLog/VisitorLog';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminDashboard.css';

function AdminDashboard() {
  const [newSubmissions, setNewSubmissions] = useState(0);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedData = localStorage.getItem('visitorRegistrations');
        const visitors = storedData ? JSON.parse(storedData) : [];
        setNewSubmissions(visitors.length);
        
        // if (visitors.length > newSubmissions) {
        //   const newVisitor = visitors[visitors.length - 1];
        //   toast.info(`New visitor: ${newVisitor.firstName} ${newVisitor.lastName}`, {
        //     position: "top-right",
        //     autoClose: 5000,
        //   });
        // }
      } catch (error) {
        console.error('Error parsing visitor data:', error);
        // Initialize with empty array if data is corrupted
        localStorage.setItem('visitorRegistrations', JSON.stringify([]));
        setNewSubmissions(0);
      }
    };

    // Initialize data if it doesn't exist
    if (!localStorage.getItem('visitorRegistrations')) {
      localStorage.setItem('visitorRegistrations', JSON.stringify([]));
    }

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [newSubmissions]);

  return (
    <div className="admin-dashboard">
      <Header />
      <main className="admin-content">
        <div className="admin-header">
          <h1>Visitor Management Dashboard</h1>
          <p>View and manage all visitor records</p>
          {/* {newSubmissions > 0 && (
            <div className="new-submissions">
              New submissions: {newSubmissions}
            </div>
          )} */}
        </div>
        <VisitorLog />
      </main>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default AdminDashboard;