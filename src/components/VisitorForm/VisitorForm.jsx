import React, { useState } from 'react';
import './VisitorForm.css';
import { toast } from 'react-toastify';

const VisitorForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    companyName: '',
    designation: '',
    phone: '',
    email: '',
    purpose: '',
    comment: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const encodeFormData = (data) =>
    Object.keys(data)
      .map(
        (key) =>
          encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
      )
      .join('&');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Submit to Netlify Forms
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormData({
          'form-name': 'visitorForm',
          ...formData,
        }),
      });
    } catch (err) {
      console.error('Netlify Form submission failed', err);
    }

    // 2. Send email via Netlify Function
    try {
      const response = await fetch('/.netlify/functions/sendThankYou', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Email function failed');
      }
    } catch (err) {
      console.error('Email error:', err);
      toast.error('Failed to send thank you email.');
    }

    // 3. Save to localStorage
    const existing = JSON.parse(localStorage.getItem('visitorRegistrations')) || [];
    const newEntry = {
      ...formData,
      id: Date.now(),
      registrationDate: new Date().toISOString(),
    };
    localStorage.setItem(
      'visitorRegistrations',
      JSON.stringify([...existing, newEntry])
    );

    // 4. Success feedback
    toast.success('Visitor registered successfully and email sent!', {
      position: 'top-center',
      autoClose: 3000,
    });

    // 5. Reset form
    setFormData({
      title: '',
      firstName: '',
      lastName: '',
      companyName: '',
      designation: '',
      phone: '',
      email: '',
      purpose: '',
      comment: '',
    });

    onSubmitSuccess();
  };

  return (
    <form
      className="visitor-form"
      name="visitorForm"
      method="POST"
      data-netlify="true"
      onSubmit={handleSubmit}
    >
      {/* Netlify Forms hidden input */}
      <input type="hidden" name="form-name" value="visitorForm" />

      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        First Name:
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Company Name:
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
        />
      </label>
      <label>
        Designation:
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
        />
      </label>
      <label>
        Phone:
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Purpose:
        <input
          type="text"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Comment:
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
        />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export default VisitorForm;
