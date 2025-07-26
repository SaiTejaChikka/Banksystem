# Bank Lending System

![Bank Lending System](https://via.placeholder.com/800x400?text=Bank+Lending+System+Screenshot)

A comprehensive banking application for loan management that allows customers to apply for loans, make payments, view transaction history, and monitor loan status.

## Features

- **Loan Application**: Create new loans with simple interest calculation
- **Payment Processing**: Record EMI and lump sum payments
- **Loan Ledger**: View detailed loan history and transactions
- **Account Overview**: See all loans associated with a customer
- **Real-time Calculations**: Automatic EMI and balance updates
- **Responsive UI**: Works on desktop and mobile devices

## Technology Stack

### Frontend
- React.js
- Bootstrap
- Axios (for API calls)

### Backend
- Node.js
- Express.js
- SQLite (in-memory database)

## Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node server.js
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React app:
```bash
npm start
```

The frontend will run on `http://localhost:3001`

## Usage Guide

### Applying for a Loan
1. Navigate to "Apply for Loan" tab
2. Enter customer details and loan parameters
3. Submit to create a new loan
4. View loan details including EMI amount

### Making Payments
1. Navigate to "Make Payment" tab
2. Enter loan ID and payment details
3. Select payment type (EMI or Lump Sum)
4. Submit to record payment
5. View updated balance and remaining EMIs

### Viewing Loan Ledger
1. Navigate to "View Loan Ledger" tab
2. Enter loan ID
3. View loan summary and transaction history

### Account Overview
1. Navigate to "Account Overview" tab
2. Enter customer ID
3. View all loans associated with the customer

## API Reference

### `POST /api/v1/loans`
Create a new loan
```json
{
  "customer_id": "string",
  "loan_amount": number,
  "loan_period_years": number,
  "interest_rate_yearly": number
}
```

### `POST /api/v1/loans/{loan_id}/payments`
Record a payment
```json
{
  "amount": number,
  "payment_type": "EMI" | "LUMP_SUM"
}
```

### `GET /api/v1/loans/{loan_id}/ledger`
Get loan ledger

### `GET /api/v1/customers/{customer_id}/overview`
Get customer account overview

## Project Structure

```
bank-lending-system/
├── backend/
│   ├── server.js             # Backend server
│   └── package.json          # Backend dependencies
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── LoanApplicationForm.js
    │   │   ├── PaymentForm.js
    │   │   ├── LoanLedger.js
    │   │   └── AccountOverview.js
    │   ├── App.js            # Main application component
    │   ├── App.css           # Global styles
    │   └── index.js          # Entry point
    ├── package.json          # Frontend dependencies
    └── README.md             # Frontend documentation
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
