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

  const getNextId = () => {
    const storedData = localStorage.getItem('visitorRegistrations');
    if (!storedData) return 1;
    
    const visitors = JSON.parse(storedData);
    return visitors.length > 0 ? Math.max(...visitors.map(v => v.id)) + 1 : 1;
  };

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
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const storedData = localStorage.getItem('visitorRegistrations');
      const visitors = storedData ? JSON.parse(storedData) : [];

      const newVisitor = {
        id: getNextId(),
        ...formData,
        registrationDate: new Date().toISOString()
      };

      const updatedVisitors = [...visitors, newVisitor];
      localStorage.setItem(
        'visitorRegistrations',
        JSON.stringify(updatedVisitors, null, 2)
      );

      window.dispatchEvent(new Event('storage'));

      toast.success('Visitor registered successfully!', {
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
      toast.error('Failed to save visitor data');
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
        <label>Email</label>
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
        <label>Purpose of Visit</label>
        <input
          type="text"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
        />
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