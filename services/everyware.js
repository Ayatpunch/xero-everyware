const { everywareConfig } = require('../config');

const {
    InvoiceService,
    WebhookService,
    PaymentService
} = require('everyware-sdk');

const invoiceService = new InvoiceService(everywareConfig);
const webhookService = new WebhookService(everywareConfig);
const paymentService = new PaymentService(everywareConfig);

module.exports = {
    invoiceService,
    webhookService,
    paymentService
}; 