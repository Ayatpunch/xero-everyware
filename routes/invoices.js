const express = require('express');
const router = express.Router();
const { invoiceService } = require('../services/everyware');

router.post('/create', async (req, res) => {
    try {
        // Validate minimum required fields according to Everyware API
        // const requiredFields = [
        //     'LineItems', 'BusinessName', 'TotalAmountDue', 'Subtotal',
        //     'BillToCellPhone', 'BusinessAddress1', 'BusinessCity',
        //     'BusinessState', 'BusinessZip', 'BillToZip'
        // ];

        // const missingFields = requiredFields.filter(field => !req.body[field]);

        // if (missingFields.length > 0) {
        //     return res.status(400).json({
        //         error: 'Missing required fields',
        //         required: missingFields
        //     });
        // }

        console.log(req.body)
        const invoice = await invoiceService.createInvoice(req.body);

        res.json(invoice);

    } catch (error) {
        console.error('Invoice Creation Error:', error)
        res.status(500).json({
            error: 'Failed to create invoice',
            details: error.message
        });
    }
});

// Test endpoint with sample data
router.get('/test-create', async (req, res) => {
    try {
        const sampleInvoice = {
            BusinessName: "Test Business",
            LineItems: [
                {
                    Description: "Test Invoice",
                    Quantity: 1,
                    AmountEach: 10,
                    Total: 10
                }
            ],
            Subtotal: 10,
            TotalAmountDue: 10,
            BillToCellPhone: "5125551212",
            BillToName: "Test Customer",
            BillToAddress1: "123 Test St",
            BillToCity: "Test City",
            BillToState: "TX",
            BillToZip: "12345",
            BusinessAddress1: "456 Business St",
            BusinessCity: "Business City",
            BusinessState: "TX",
            BusinessZip: "54321",
            SendSMSInvoice: true,
            generateQRCode: true,
            IsPartialPayment: false
        };

        const response = await fetch('http://localhost:5005/invoices/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sampleInvoice)
        });

        const result = await response.json();
        res.json(result);

    } catch (error) {
        console.error('Test Invoice Creation Error:', error);
        res.status(500).json({
            error: 'Failed to create test invoice',
            details: error.message
        });
    }
});

module.exports = router; 