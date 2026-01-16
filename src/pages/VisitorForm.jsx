import React, { useState } from 'react';
import { visitorAPI } from '../services/api';
import { Link } from 'react-router-dom';

const VisitorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    purpose: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await visitorAPI.create(formData);
      setMessage({ type: 'success', text: 'Registration successful! Please wait for approval.' });
      setFormData({ name: '', contact: '', purpose: '' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="visitor-form-container">
      <div className="visitor-form-card">
        <h1 className="form-title">Visitor Registration</h1>
        <p className="form-subtitle">Please fill in your details to register</p>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="visitor-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Number *</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              placeholder="Enter your contact number"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="purpose">Purpose of Visit *</label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              placeholder="Enter purpose of your visit"
              className="form-textarea"
              rows="4"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="form-footer">
          <p>Staff Login: <Link to="/login">Click here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default VisitorForm;
