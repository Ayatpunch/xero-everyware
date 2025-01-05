const express = require('express');
const router = express.Router();
const { webhookService } = require('../services/everyware');
const { createAndPayInvoice } = require('../services/xero');
const { requireXeroAuth } = require('../middleware/auth');

// Add requireXeroAuth middleware to ensure we have Xero authentication
router.post('/payment', express.urlencoded({ extended: true }), requireXeroAuth, async (req, res) => {
    try {
        const {
            PaymentSid,
            StatusID,
            PaymentAmt,
            PaymentDate,
            TransactionID,
            OrderNumber,
            ServiceDescription,
            CardType,
            LastFour,
            Phone,
            EmailAddress
        } = req.body;

        console.log(req.body);

        // Verify payment was successful
        if (StatusID !== "0") {
            console.error('Payment failed:', req.body.ResponseMessage);
            return res.sendStatus(200); // Acknowledge receipt even for failed payments
        }

        // Format data for Xero invoice creation
        const paymentData = {
            customerName: EmailAddress || Phone, // Use email or phone as customer identifier
            description: ServiceDescription,
            amount: parseFloat(PaymentAmt),
            tenantId: req.xeroTenantId, // Get tenantId from requireXeroAuth middleware
            reference: OrderNumber,
            paymentDate: PaymentDate,
            paymentMethod: `${CardType} ending in ${LastFour}`
        };

        // Create and pay invoice in Xero
        const { invoice, payment } = await createAndPayInvoice(paymentData);

        console.log('Payment processed:', {
            paymentSid: PaymentSid,
            transactionId: TransactionID,
            xeroInvoiceId: invoice.InvoiceID
        });

        res.sendStatus(200);
    } catch (error) {
        console.error('Webhook Error:', error);
        console.error('Request body:', req.body);
        res.sendStatus(500);
    }
});

module.exports = router; 