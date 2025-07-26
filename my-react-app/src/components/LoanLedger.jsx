// File: src/components/LoanLedger.js
import React, { useState } from 'react';
import axios from 'axios';

const LoanLedger = () => {
  const [loanId, setLoanId] = useState('');
  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    if (!loanId) {
      setError('Please enter a Loan ID');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:3000/api/v1/loans/${loanId}/ledger`
      );
      setLedger(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch loan ledger');
      setLedger(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Loan Ledger</h2>
        
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Loan ID"
                value={loanId}
                onChange={(e) => setLoanId(e.target.value)}
              />
              <button 
                className="btn btn-primary" 
                type="button"
                onClick={handleFetch}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'View Ledger'}
              </button>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        {ledger && (
          <div>
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Loan Summary</h5>
                    <p><strong>Customer ID:</strong> {ledger.customer_id}</p>
                    <p><strong>Principal:</strong> ${ledger.principal.toFixed(2)}</p>
                    <p><strong>Total Amount:</strong> ${ledger.total_amount.toFixed(2)}</p>
                    <p><strong>Monthly EMI:</strong> ${ledger.monthly_emi.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Payment Status</h5>
                    <p><strong>Amount Paid:</strong> ${ledger.amount_paid.toFixed(2)}</p>
                    <p><strong>Balance Amount:</strong> ${ledger.balance_amount.toFixed(2)}</p>
                    <p><strong>EMIs Left:</strong> {ledger.emis_left}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <h4>Transaction History</h4>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.transactions.length > 0 ? (
                    ledger.transactions.map((txn) => (
                      <tr key={txn.transaction_id}>
                        <td>{txn.transaction_id}</td>
                        <td>{new Date(txn.date).toLocaleString()}</td>
                        <td>${txn.amount.toFixed(2)}</td>
                        <td>{txn.type}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">No transactions found</td>
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

export default LoanLedger;