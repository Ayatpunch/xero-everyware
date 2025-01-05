const express = require('express');
const router = express.Router();
const { xeroClient, setTokenSet, requireXeroAuth } = require('../middleware/auth');

// Initialize Xero OAuth flow
router.get('/xero', async (req, res) => {
    try {
        const consentUrl = await xeroClient.buildConsentUrl();
        res.redirect(consentUrl);
    } catch (error) {
        console.error('Xero Auth Error:', error);
        res.status(500).send('Authentication failed');
    }
});

// Test route to verify authentication
router.get('/test', requireXeroAuth, async (req, res) => {
    try {
        const response = await req.xeroClient.accountingApi.getContacts(req.xeroTenantId);
        res.json({
            message: 'Authentication successful',
            tenantId: req.xeroTenantId,
            contacts: response.body.contacts
        });
    } catch (error) {
        console.error('Test Route Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 