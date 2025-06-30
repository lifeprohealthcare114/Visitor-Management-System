import React, { useState, useEffect } from 'react';
import './AnnouncementBanner.css';

const announcements = [
  "Company picnic scheduled for June 15th!",
  "New security policy in effect - please check your email",
  "Parking lot will be closed for maintenance on Friday"
];

function AnnouncementBanner() {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => 
        prev === announcements.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="announcement-banner">
      <div className="announcement-content">
        <span className="announcement-icon">📢</span>
        <div className="announcement-text">
          {announcements[currentAnnouncement]}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementBanner;