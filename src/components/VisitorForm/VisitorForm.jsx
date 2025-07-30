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
      const netlifyFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        netlifyFormData.append(key, value);
      });
      netlifyFormData.append('form-name', 'visitorForm');

      await fetch('/', {
        method: 'POST',
        body: netlifyFormData,
      });

      const emailResponse = await fetch('/.netlify/functions/sendThankYou', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      if (!emailResponse.ok) {
        let errorMsg = `Error ${emailResponse.status}: ${emailResponse.statusText}`;
        try {
          const errorData = await emailResponse.json();
          errorMsg = errorData.error || errorMsg;
        } catch (jsonError) {
          console.warn('No JSON response from server:', jsonError);
        }

        toast.error(`Failed to send thank you email: ${errorMsg}`, {
          position: "top-center",
          autoClose: 4000,
        });
        return;
      }

      const notifyResponse = await fetch('/.netlify/functions/notifyAdmin', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      if (!notifyResponse.ok) {
        let errorMsg = `Error ${notifyResponse.status}: ${notifyResponse.statusText}`;
        try {
          const errorData = await notifyResponse.json();
          errorMsg = errorData.error || errorMsg;
        } catch (jsonError) {
          console.warn('No JSON response from server:', jsonError);
        }

        toast.error(`Thank you email sent, but failed to notify admin: ${errorMsg}`, {
          position: "top-center",
          autoClose: 4000,
        });
        return;
      }

      toast.success("Admin notified!", {
        position: "top-center",
        autoClose: 4000,
      });

      toast.success('Visitor registered successfully', {
        position: "top-center",
        autoClose: 3000,
      });

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
      toast.error('Failed to register successfully');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="visitor-form"
      onSubmit={handleSubmit}
      name="visitorForm"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      role="form"
    >
      <input type="hidden" name="form-name" value="visitorForm" />
      <input type="hidden" name="bot-field" />

      <h2>Visitor Registration</h2>

      <div className="form-group">
        <label htmlFor="title">Title*</label>
        <select
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'input-error' : ''}
          aria-required="true"
          aria-invalid={!!errors.title}
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
        <label htmlFor="firstName">First Name*</label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={errors.firstName ? 'input-error' : ''}
          aria-required="true"
          aria-invalid={!!errors.firstName}
        />
        {errors.firstName && <span className="error-message">{errors.firstName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Last Name*</label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={errors.lastName ? 'input-error' : ''}
          aria-required="true"
          aria-invalid={!!errors.lastName}
        />
        {errors.lastName && <span className="error-message">{errors.lastName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="companyName">Company Name</label>
        <input
          id="companyName"
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="designation">Designation</label>
        <input
          id="designation"
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number*</label>
        <PhoneInput
          id="phone"
          name="phone"
          international
          defaultCountry="IN"
          value={formData.phone}
          onChange={handlePhoneChange}
          aria-label="Phone Number"
          aria-required="true"
          aria-invalid={!!errors.phone}
          className={errors.phone ? 'phone-input-error' : ''}
        />
        {errors.phone && <span className="error-message">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email*</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'input-error' : ''}
          aria-required="true"
          aria-invalid={!!errors.email}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="purpose">Purpose of Visit*</label>
        <input
          id="purpose"
          type="text"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          className={errors.purpose ? 'input-error' : ''}
          aria-required="true"
          aria-invalid={!!errors.purpose}
        />
        {errors.purpose && <span className="error-message">{errors.purpose}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="comment">Comments</label>
        <textarea
          id="comment"
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
