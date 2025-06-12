require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Send notification
app.post('/send-notification', async (req, res) => {
    try {
        const orderData = req.body;
        console.log('Received order notification request:', orderData);
        
        // Send email notification
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.NOTIFICATION_EMAIL,
            subject: 'New Order Received',
            html: `
                <h2>New Order Details</h2>
                <p><strong>Product:</strong> ${orderData.product}</p>
                <p><strong>Price:</strong> ${orderData.price} Taka</p>
                <p><strong>Size:</strong> ${orderData.size}</p>
                <p><strong>Customer:</strong> ${orderData.customerName}</p>
                <p><strong>Email:</strong> ${orderData.email}</p>
                <p><strong>Phone:</strong> ${orderData.phone}</p>
                <p><strong>Address:</strong> ${orderData.address}</p>
                <p><strong>Delivery Location:</strong> ${orderData.deliveryLocation}</p>
                <p><strong>Delivery Charge:</strong> ${orderData.deliveryCharge} Taka</p>
                <p><strong>Total Amount:</strong> ${orderData.total} Taka</p>
                <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
                <p><strong>Order Time:</strong> ${new Date(orderData.timestamp).toLocaleString()}</p>
            `
        });

        console.log('Order notification email sent successfully');
        res.json({ success: true });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
