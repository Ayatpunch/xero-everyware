const { XeroClient } = require('xero-node');
const { xeroConfig } = require('../config');

const xeroClient = new XeroClient({
    clientId: xeroConfig.clientId,
    clientSecret: xeroConfig.clientSecret,
    redirectUris: [xeroConfig.redirectUri],
    scopes: xeroConfig.scopes.split(' ')
});

// Store tokens and tenantId in memory (use database in production)
let tokenSet = null;
let tenantId = null;

/**
 * @module middleware/auth
 * @description Handles Xero authentication and session management
 */

/**
 * @function requireXeroAuth
 * @description Express middleware to ensure valid Xero authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {Error} If authentication fails or token is invalid
 */

async function requireXeroAuth(req, res, next) {
    try {
        if (!tokenSet || tokenSet.expired()) {
            return res.redirect('/auth/xero');
        }

        // Set the token for the request
        await xeroClient.setTokenSet(tokenSet);

        // Get tenants if we don't have one
        if (!tenantId) {
            const tenants = await xeroClient.updateTenants();
            tenantId = tenants[0].tenantId;
        }

        req.xeroClient = xeroClient;
        req.xeroTenantId = tenantId;

        next();
    } catch (error) {
        console.error('Auth Error:', error);
        res.redirect('/auth/xero');
    }
}

module.exports = {
    xeroClient,
    requireXeroAuth,
    setTokenSet: (tokens) => {
        tokenSet = tokens;
    },
    getStoredTenantId: () => tenantId,
    setTenantId: (id) => { tenantId = id; }
}; 