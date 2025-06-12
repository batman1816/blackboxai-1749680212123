# The Fashion & The Furious - F1 Fashion E-commerce

An e-commerce website for Formula 1 themed fashion items with integrated payment processing, order tracking, and notification system.

## Features

- Modern, responsive design
- Secure checkout process
- Stripe payment integration
- Google Sheets order tracking
- Email notifications for new orders
- Size selection and order management

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Copy `.env.example` to `.env`
- Add your Stripe API keys
- Configure Google Sheets credentials
- Set up email notification settings

3. Set up Google Sheets:
- Create a new Google Sheet
- Share it with your service account email
- Copy the Spreadsheet ID to .env
- Create a sheet named 'Orders' with the following columns:
  - Timestamp
  - Product ID
  - Product Name
  - Price
  - Customer Name
  - Email
  - Phone
  - Address
  - Size

4. Start the server:
```bash
npm start
```

## Payment Processing

The website uses Stripe for secure payment processing. Test card numbers:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002

## Order Management

Orders are automatically:
1. Processed through Stripe
2. Recorded in Google Sheets
3. Notified via email

## Development

For development with auto-reload:
```bash
npm run dev
```

## Security Notes

- Never commit .env file
- Keep API keys secure
- Regularly rotate credentials
- Monitor Stripe dashboard for transactions
- Regularly backup Google Sheets data
