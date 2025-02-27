const express = require('express');
const router = express.Router();
const { webhookService } = require('../services/everyware');
const { createAndPayInvoice } = require('../services/xero');
const { getStoredTenantId } = require('../middleware/auth');

/**
 * @module routes/webhooks
 * @description Handles incoming webhooks from Everyware's payment system
 */

/**
 * @route POST /webhooks/payment
 * @description Processes payment notifications from Everyware and creates corresponding records in Xero
 * @param {Object} req.body - The webhook payload from Everyware
 * @param {string} req.body.PaymentSid - Unique payment identifier
 * @param {string} req.body.StatusID - Payment status (0 for success)
 * @param {string} req.body.PaymentAmt - Payment amount
 * @param {string} req.body.PaymentDate - Date of payment
 * @param {string} req.body.TransactionID - Transaction identifier
 * @param {string} req.body.OrderNumber - Order reference number
 * @param {string} req.body.ServiceDescription - Description of service
 * @param {string} req.body.CardType - Type of card used
 * @param {string} req.body.LastFour - Last four digits of card
 * @param {string} req.body.Phone - Customer phone number
 * @param {string} req.body.EmailAddress - Customer email address
 */

router.post('/payment', express.urlencoded({ extended: true }), async (req, res) => {
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
            return res.sendStatus(200);
        }

        const storedTenantId = getStoredTenantId();
        if (!storedTenantId) {
            throw new Error('No Xero tenant ID found. Please authenticate with Xero first.');
        }

        // Format data for Xero invoice creation
        const paymentData = {
            customerName: EmailAddress || Phone,
            description: ServiceDescription,
            amount: parseFloat(PaymentAmt),
            tenantId: storedTenantId,
            reference: OrderNumber,
            paymentDate: PaymentDate,
            paymentMethod: `${CardType} ending in ${LastFour}`
        };

        // Create and pay invoice in Xero
        const { invoice, payment } = await createAndPayInvoice(paymentData);

        console.log('Payment processed:', {
            paymentSid: PaymentSid,
            transactionId: TransactionID,
            xeroInvoiceId: invoice.invoiceID
        });

        res.sendStatus(200);
    } catch (error) {
        console.error('Webhook Error:', error);
        console.error('Request body:', req.body);
        res.sendStatus(500);
    }
});

module.exports = router; 