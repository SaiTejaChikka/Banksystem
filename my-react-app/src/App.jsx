// File: src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import LoanApplicationForm from './components/LoanApplicationForm.jsx';
import PaymentForm from './components/PaymentForm.jsx';
import LoanLedger from './components/LoanLedger.jsx';
import AccountOverview from './components/AccountOverview.jsx';
import CustomerForm from './components/CustomerForm.jsx';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('loan');
  
  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container shadow rounded p-4 bg-white">
        <h1 className="text-center mb-4 display-5 fw-bold text-primary">Bank Lending System</h1>
        <CustomerForm />
        <ul className="nav nav-tabs mb-4 justify-content-center">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'loan' ? 'active' : ''}`}
              onClick={() => setActiveTab('loan')}
            >
              <i className="bi bi-cash-coin me-2"></i>Apply for Loan
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'payment' ? 'active' : ''}`}
              onClick={() => setActiveTab('payment')}
            >
              <i className="bi bi-credit-card me-2"></i>Make Payment
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'ledger' ? 'active' : ''}`}
              onClick={() => setActiveTab('ledger')}
            >
              <i className="bi bi-journal-text me-2"></i>View Loan Ledger
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="bi bi-person-badge me-2"></i>Account Overview
            </button>
          </li>
        </ul>
        <div className="tab-content p-3">
          {activeTab === 'loan' && <LoanApplicationForm />}
          {activeTab === 'payment' && <PaymentForm />}
          {activeTab === 'ledger' && <LoanLedger />}
          {activeTab === 'overview' && <AccountOverview />}
        </div>
      </div>
    </div>
  );
}

export default App;