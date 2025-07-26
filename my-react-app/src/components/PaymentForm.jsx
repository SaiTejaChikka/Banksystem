// File: src/components/PaymentForm.js
import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    loan_id: '',
    amount: '',
    payment_type: 'EMI'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors = {};
    if (!formData.loan_id) errors.loan_id = 'Loan ID is required';
    if (!formData.amount || formData.amount <= 0) 
      errors.amount = 'Amount must be positive';
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
      const response = await axios.post(
        `http://localhost:3000/api/v1/loans/${formData.loan_id}/payments`,
        {
          amount: Number(formData.amount),
          payment_type: formData.payment_type
        }
      );
      
      setResult(response.data);
      setFormData({
        loan_id: '',
        amount: '',
        payment_type: 'EMI'
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Make Payment</h2>
        
        {error && typeof error === 'string' && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Loan ID</label>
            <input
              type="text"
              className={`form-control ${error?.loan_id ? 'is-invalid' : ''}`}
              name="loan_id"
              value={formData.loan_id}
              onChange={handleChange}
            />
            {error?.loan_id && (
              <div className="invalid-feedback">{error.loan_id}</div>
            )}
          </div>
          
          <div className="mb-3">
            <label className="form-label">Amount ($)</label>
            <input
              type="number"
              className={`form-control ${error?.amount ? 'is-invalid' : ''}`}
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
            {error?.amount && (
              <div className="invalid-feedback">{error.amount}</div>
            )}
          </div>
          
          <div className="mb-3">
            <label className="form-label">Payment Type</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment_type"
                  value="EMI"
                  checked={formData.payment_type === 'EMI'}
                  onChange={handleChange}
                />
                <label className="form-check-label">EMI</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment_type"
                  value="LUMP_SUM"
                  checked={formData.payment_type === 'LUMP_SUM'}
                  onChange={handleChange}
                />
                <label className="form-check-label">Lump Sum</label>
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit Payment'}
          </button>
        </form>
        
        {result && (
          <div className="mt-4">
            <h3>Payment Successful!</h3>
            <div className="alert alert-success">
              <p><strong>Payment ID:</strong> {result.payment_id}</p>
              <p><strong>Remaining Balance:</strong> ${result.remaining_balance.toFixed(2)}</p>
              <p><strong>EMIs Left:</strong> {result.emis_left}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;