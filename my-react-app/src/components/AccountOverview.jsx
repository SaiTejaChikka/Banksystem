// File: src/components/AccountOverview.js
import React, { useState } from 'react';
import axios from 'axios';

const AccountOverview = () => {
  const [customerId, setCustomerId] = useState('');
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    if (!customerId) {
      setError('Please enter a Customer ID');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:3000/api/v1/customers/${customerId}/overview`
      );
      setOverview(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch account overview');
      setOverview(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Account Overview</h2>
        
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
              <button 
                className="btn btn-primary" 
                type="button"
                onClick={handleFetch}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'View Overview'}
              </button>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        {overview && (
          <div>
            <div className="alert alert-info">
              <h5>Customer Summary</h5>
              <p><strong>Customer ID:</strong> {overview.customer_id}</p>
              <p><strong>Total Loans:</strong> {overview.total_loans}</p>
            </div>
            
            <h4>Loan Details</h4>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Loan ID</th>
                    <th>Principal</th>
                    <th>Total Amount</th>
                    <th>Total Interest</th>
                    <th>EMI Amount</th>
                    <th>Amount Paid</th>
                    <th>EMIs Left</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.loans.length > 0 ? (
                    overview.loans.map((loan) => (
                      <tr key={loan.loan_id}>
                        <td>{loan.loan_id}</td>
                        <td>${loan.principal.toFixed(2)}</td>
                        <td>${loan.total_amount.toFixed(2)}</td>
                        <td>${loan.total_interest.toFixed(2)}</td>
                        <td>${loan.emi_amount.toFixed(2)}</td>
                        <td>${loan.amount_paid.toFixed(2)}</td>
                        <td>{loan.emis_left}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">No loans found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountOverview;