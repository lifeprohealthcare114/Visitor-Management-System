// src/components/VisitorForm/VisitorForm.jsx
import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from 'react-toastify';
import './VisitorForm.css';

function VisitorForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    companyName: '',
    designation: '',
    phone: '',
    email: '',
    purpose: '',
    comment: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.phone) newErrors.phone = 'Phone Number is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.purpose) newErrors.purpose = 'Purpose is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      /*
      // Original backend submission commented out as requested
      const response = await fetch("http://localhost:8080/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        let errMsg = "Failed to save visitor data";
        try {
          const err = await response.json();
          errMsg = err.error || Object.values(err).join(' ') || errMsg;
        } catch (_) {}
        toast.error(errMsg, { position: "top-center", autoClose: 3000 });
        return;
      }
      */

      // Call Netlify Function to send thank-you email via Gmail SMTP
      const emailResponse = await fetch('/.netlify/functions/sendThankYou.js', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        toast.error(`Failed to send thank you email: ${errorData.error || 'Unknown error'}`, { position: "top-center", autoClose: 4000 });
        return;
      }

      toast.success('Visitor registered successfully and thank you email sent!', {
        position: "top-center",
        autoClose: 3000,
      });

      // Reset form after success
      setFormData({
        title: '',
        firstName: '',
        lastName: '',
        companyName: '',
        designation: '',
        phone: '',
        email: '',
        purpose: '',
        comment: ''
      });

      onSubmitSuccess();

    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save visitor data or send thank you email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="visitor-form" onSubmit={handleSubmit}>
      <h2>Visitor Registration</h2>

      <div className="form-group">
        <label>Title*</label>
        <select
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'input-error' : ''}
        >
          <option value="">Select Title</option>
          <option value="Mr">Mr.</option>
          <option value="Mrs">Mrs.</option>
          <option value="Ms">Ms.</option>
          <option value="Dr">Dr.</option>
        </select>
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label>First Name*</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={errors.firstName ? 'input-error' : ''}
        />
        {errors.firstName && <span className="error-message">{errors.firstName}</span>}
      </div>

      <div className="form-group">
        <label>Last Name*</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={errors.lastName ? 'input-error' : ''}
        />
        {errors.lastName && <span className="error-message">{errors.lastName}</span>}
      </div>

      <div className="form-group">
        <label>Company Name</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Designation</label>
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Phone Number*</label>
        <PhoneInput
          international
          defaultCountry="IN"
          value={formData.phone}
          onChange={handlePhoneChange}
          className={errors.phone ? 'phone-input-error' : ''}
        />
        {errors.phone && <span className="error-message">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label>Email*</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'input-error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>Purpose of Visit*</label>
        <input
          type="text"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          className={errors.purpose ? 'input-error' : ''}
        />
        {errors.purpose && <span className="error-message">{errors.purpose}</span>}
      </div>

      <div className="form-group">
        <label>Comments</label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          rows="3"
        ></textarea>
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

export default VisitorForm;
