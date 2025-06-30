import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ThankYouMessage.css';

function ThankYouMessage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 15000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="thank-you-container">
      <div className="thank-you-card">
        <h2>Thank You for Your Visit!</h2>
        <p>Your details have been successfully recorded.</p>
        <p>You'll be redirected to the home page in 15 seconds...</p>
        <button onClick={handleClose} className="close-button">
          Return Home Now
        </button>
      </div>
    </div>
  );
}

export default ThankYouMessage;