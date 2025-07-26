// File: src/components/LoanApplicationForm.js
import React, { useState } from 'react';
import axios from 'axios';

const LoanApplicationForm = () => {
  const [formData, setFormData] = useState({
    customer_id: '',
    loan_amount: '',
    loan_period_years: '',
    interest_rate_yearly: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors = {};
    if (!formData.customer_id) errors.customer_id = 'Customer ID is required';
    if (!formData.loan_amount || formData.loan_amount <= 0) errors.loan_amount = 'Loan amount must be positive';
    if (!formData.loan_period_years || formData.loan_period_years <= 0) errors.loan_period_years = 'Loan period must be positive';
    if (!formData.interest_rate_yearly || formData.interest_rate_yearly <= 0) errors.interest_rate_yearly = 'Interest rate must be positive';
    return errors;
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/api/v1/loans', {
        ...formData,
        loan_amount: Number(formData.loan_amount),
        loan_period_years: Number(formData.loan_period_years),
        interest_rate_yearly: Number(formData.interest_rate_yearly)
      });
      setResult(response.data);
      setFormData({
        customer_id: '',
        loan_amount: '',
        loan_period_years: '',
        interest_rate_yearly: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-body">
        <h2 className="card-title text-primary mb-3">
          <i className="bi bi-cash-coin me-2"></i>Loan Application
        </h2>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control form-control-lg"
              name="customer_id"
              placeholder="Customer ID"
              value={formData.customer_id}
              onChange={handleChange}
            />
            {error?.customer_id && <div className="text-danger small">{error.customer_id}</div>}
          </div>
          <div className="col-md-6">
            <input
              type="number"
              className="form-control form-control-lg"
              name="loan_amount"
              placeholder="Loan Amount"
              value={formData.loan_amount}
              onChange={handleChange}
            />
            {error?.loan_amount && <div className="text-danger small">{error.loan_amount}</div>}
          </div>
          <div className="col-md-6">
            <input
              type="number"
              className="form-control form-control-lg"
              name="loan_period_years"
              placeholder="Loan Period (years)"
              value={formData.loan_period_years}
              onChange={handleChange}
            />
            {error?.loan_period_years && <div className="text-danger small">{error.loan_period_years}</div>}
          </div>
          <div className="col-md-6">
            <input
              type="number"
              className="form-control form-control-lg"
              name="interest_rate_yearly"
              placeholder="Interest Rate (%)"
              value={formData.interest_rate_yearly}
              onChange={handleChange}
            />
            {error?.interest_rate_yearly && <div className="text-danger small">{error.interest_rate_yearly}</div>}
          </div>
          <div className="col-12 d-grid">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              <i className="bi bi-arrow-right-circle me-1"></i>
              {loading ? 'Processing...' : 'Apply for Loan'}
            </button>
          </div>
        </form>
        {result && (
          <div className="alert alert-success mt-3">
            <i className="bi bi-check2-circle me-2"></i>Loan created!<br />
            <span className="fw-bold">Loan ID:</span> <span className="badge bg-primary">{result.loan_id}</span><br />
            <span className="fw-bold">Total Amount Payable:</span> <span className="badge bg-info text-dark">{result.total_amount_payable}</span><br />
            <span className="fw-bold">Monthly EMI:</span> <span className="badge bg-success">{result.monthly_emi.toFixed(2)}</span>
          </div>
        )}
        {error && typeof error === 'object' && (
          <div className="alert alert-danger mt-3">
            <i className="bi bi-exclamation-circle me-2"></i>
            {Object.values(error).map((err, idx) => <div key={idx}>{err}</div>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanApplicationForm;
