// File: server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Create database tables
db.serialize(() => {
  db.run(`
    CREATE TABLE Customers (
      customer_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.run(`
    CREATE TABLE Loans (
      loan_id TEXT PRIMARY KEY,
      customer_id TEXT,
      principal_amount DECIMAL NOT NULL,
      total_amount DECIMAL NOT NULL,
      interest_rate DECIMAL NOT NULL,
      loan_period_years INTEGER NOT NULL,
      monthly_emi DECIMAL NOT NULL,
      status TEXT DEFAULT 'ACTIVE',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
    )
  `);
  
  db.run(`
    CREATE TABLE Payments (
      payment_id TEXT PRIMARY KEY,
      loan_id TEXT,
      amount DECIMAL NOT NULL,
      payment_type TEXT CHECK(payment_type IN ('EMI', 'LUMP_SUM')) NOT NULL,
      payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (loan_id) REFERENCES Loans(loan_id)
    )
  `);
});

// Helper function for database queries
// 0. Create Customer Endpoint
app.post('/api/v1/customers', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const customerId = uuidv4();
  try {
    await dbRun(
      `INSERT INTO Customers (customer_id, name) VALUES (?, ?)`,
      [customerId, name]
    );
    res.status(201).json({ customer_id: customerId, name });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
const dbGet = (query, params) => new Promise((resolve, reject) => {
  db.get(query, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

const dbAll = (query, params) => new Promise((resolve, reject) => {
  db.all(query, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

const dbRun = (query, params) => new Promise((resolve, reject) => {
  db.run(query, params, function(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

// 1. Create Loan Endpoint
app.post('/api/v1/loans', async (req, res) => {
  const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;
  
  // Validation
  if (!customer_id || !loan_amount || !loan_period_years || !interest_rate_yearly) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Calculate loan details
  const totalInterest = loan_amount * loan_period_years * (interest_rate_yearly / 100);
  const totalAmount = Number(loan_amount) + Number(totalInterest);
  const monthlyEmi = totalAmount / (loan_period_years * 12);
  
  const loanId = uuidv4();
  
  try {
    // Create loan record
    await dbRun(
      `INSERT INTO Loans (
        loan_id, customer_id, principal_amount, 
        total_amount, interest_rate, loan_period_years, monthly_emi
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        loanId, customer_id, loan_amount,
        totalAmount, interest_rate_yearly, 
        loan_period_years, monthlyEmi
      ]
    );
    
    res.status(201).json({
      loan_id: loanId,
      customer_id,
      total_amount_payable: totalAmount,
      monthly_emi: monthlyEmi
    });
    
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. Record Payment Endpoint
app.post('/api/v1/loans/:loan_id/payments', async (req, res) => {
  const loanId = req.params.loan_id;
  const { amount, payment_type } = req.body;
  
  if (!amount || !payment_type || !['EMI', 'LUMP_SUM'].includes(payment_type)) {
    return res.status(400).json({ error: 'Invalid payment details' });
  }
  
  try {
    // Get loan details
    const loan = await dbGet(
      `SELECT * FROM Loans WHERE loan_id = ?`,
      [loanId]
    );
    
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    
    // Record payment
    const paymentId = uuidv4();
    await dbRun(
      `INSERT INTO Payments (payment_id, loan_id, amount, payment_type)
       VALUES (?, ?, ?, ?)`,
      [paymentId, loanId, amount, payment_type]
    );
    
    // Get all payments for loan
    const payments = await dbAll(
      `SELECT amount FROM Payments WHERE loan_id = ?`,
      [loanId]
    );
    
    // Calculate new balance
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const balanceAmount = loan.total_amount - totalPaid;
    
    // Calculate remaining EMIs
    let emisLeft = 0;
    if (balanceAmount > 0) {
      emisLeft = Math.ceil(balanceAmount / loan.monthly_emi);
    }
    
    // Update loan status if paid off
    if (balanceAmount <= 0) {
      await dbRun(
        `UPDATE Loans SET status = 'PAID_OFF' WHERE loan_id = ?`,
        [loanId]
      );
    }
    
    res.json({
      payment_id: paymentId,
      loan_id: loanId,
      message: 'Payment recorded successfully',
      remaining_balance: balanceAmount,
      emis_left: emisLeft
    });
    
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// 3. Loan Ledger Endpoint
app.get('/api/v1/loans/:loan_id/ledger', async (req, res) => {
  const loanId = req.params.loan_id;
  
  try {
    const loan = await dbGet(
      `SELECT * FROM Loans WHERE loan_id = ?`,
      [loanId]
    );
    
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    
    const payments = await dbAll(
      `SELECT payment_id AS transaction_id, 
              payment_date AS date,
              amount,
              payment_type AS type
       FROM Payments
       WHERE loan_id = ?
       ORDER BY payment_date`,
      [loanId]
    );
    
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const balanceAmount = loan.total_amount - totalPaid;
    
    res.json({
      loan_id: loanId,
      customer_id: loan.customer_id,
      principal: loan.principal_amount,
      total_amount: loan.total_amount,
      monthly_emi: loan.monthly_emi,
      amount_paid: totalPaid,
      balance_amount: balanceAmount,
      emis_left: Math.ceil(balanceAmount / loan.monthly_emi),
      transactions: payments
    });
    
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// 4. Account Overview Endpoint
app.get('/api/v1/customers/:customer_id/overview', async (req, res) => {
  const customerId = req.params.customer_id;
  
  try {
    const loans = await dbAll(
      `SELECT * FROM Loans WHERE customer_id = ?`,
      [customerId]
    );
    
    if (!loans.length) return res.status(404).json({ error: 'No loans found' });
    
    const loanDetails = await Promise.all(loans.map(async loan => {
      const payments = await dbAll(
        `SELECT amount FROM Payments WHERE loan_id = ?`,
        [loan.loan_id]
      );
      
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
      const balanceAmount = loan.total_amount - totalPaid;
      
      return {
        loan_id: loan.loan_id,
        principal: loan.principal_amount,
        total_amount: loan.total_amount,
        total_interest: loan.total_amount - loan.principal_amount,
        emi_amount: loan.monthly_emi,
        amount_paid: totalPaid,
        emis_left: Math.ceil(balanceAmount / loan.monthly_emi)
      };
    }));
    
    res.json({
      customer_id: customerId,
      total_loans: loans.length,
      loans: loanDetails
    });
    
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});