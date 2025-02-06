/**
 * @module services/everyware
 * @description Wrapper for Everyware SDK services including invoicing, webhooks, and payments
 */

const { everywareConfig } = require('../config');

const {
    InvoiceService,
    WebhookService,
    PaymentService
} = require('everyware-sdk');

const invoiceService = new InvoiceService(everywareConfig);
const webhookService = new WebhookService(everywareConfig);
const paymentService = new PaymentService(everywareConfig);

/**
 * @const {InvoiceService} invoiceService
 * @description Service for managing Everyware invoices
 */

/**
 * @const {WebhookService} webhookService
 * @description Service for handling Everyware webhooks
 */

/**
 * @const {PaymentService} paymentService
 * @description Service for processing Everyware payments
 */

module.exports = {
    invoiceService,
    webhookService,
    paymentService
}; 