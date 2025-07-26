import React, { useState } from 'react';
import axios from 'axios';

const CustomerForm = () => {
  const [name, setName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCustomerId('');
    if (!name) {
      setError('Name is required');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3000/api/v1/customers', { name });
      setCustomerId(res.data.customer_id);
      setSuccess('Customer created successfully!');
      setName('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create customer');
    }
  };

  return (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-body">
        <h2 className="card-title text-primary mb-3">
          <i className="bi bi-person-plus me-2"></i>Create Customer
        </h2>
        <form onSubmit={handleSubmit} className="row g-3 align-items-center">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter customer name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="col-md-4 d-grid">
            <button type="submit" className="btn btn-success btn-lg">
              <i className="bi bi-check-circle me-1"></i> Create
            </button>
          </div>
        </form>
        {error && <div className="alert alert-danger mt-3"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}
        {success && <div className="alert alert-success mt-3"><i className="bi bi-check2-circle me-2"></i>{success} <br/>Customer ID: <span className="badge bg-primary">{customerId}</span></div>}
      </div>
    </div>
  );
};

export default CustomerForm;
