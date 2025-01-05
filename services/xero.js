const { xeroClient } = require('../middleware/auth');

async function createAndPayInvoice(paymentData) {
    try {
        // Create invoice
        const invoice = {
            Type: "ACCREC",
            Contact: {
                Name: paymentData.customerName
            },
            LineItems: [
                {
                    Description: paymentData.description,
                    Quantity: 1.0,
                    UnitAmount: paymentData.amount,
                    AccountCode: "200"
                }
            ],
            Status: "AUTHORISED",
            Reference: paymentData.reference,
            Date: paymentData.paymentDate
        };

        const response = await xeroClient.accountingApi.createInvoices(
            paymentData.tenantId,
            { invoices: [invoice] }
        );

        const createdInvoice = response.body.invoices[0];

        // Create payment
        const payment = {
            Invoice: { InvoiceID: createdInvoice.InvoiceID },
            Account: { Code: "090" },
            Amount: paymentData.amount,
            Date: paymentData.paymentDate,
            Reference: paymentData.paymentMethod
        };

        await xeroClient.accountingApi.createPayment(
            paymentData.tenantId,
            payment
        );

        return { invoice: createdInvoice, payment };
    } catch (error) {
        console.error('Xero API Error:', error);
        throw error;
    }
}

module.exports = {
    createAndPayInvoice
}; 