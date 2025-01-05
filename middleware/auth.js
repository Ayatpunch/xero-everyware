const { XeroClient } = require('xero-node');
const { xeroConfig } = require('../config');

const xeroClient = new XeroClient({
    clientId: xeroConfig.clientId,
    clientSecret: xeroConfig.clientSecret,
    redirectUris: [xeroConfig.redirectUri],
    scopes: xeroConfig.scopes.split(' ')
});

// Store tokens in memory (in production, use a proper database)
let tokenSet = null;

async function requireXeroAuth(req, res, next) {
    try {
        if (!tokenSet || tokenSet.expired()) {
            return res.redirect('/auth/xero');
        }

        // Set the token for the request
        await xeroClient.setTokenSet(tokenSet);

        // Get tenants
        const tenants = await xeroClient.updateTenants();
        req.xeroClient = xeroClient;
        req.xeroTenantId = tenants[0].tenantId;

        next();
    } catch (error) {
        console.error('Auth Error:', error);
        res.redirect('/auth/xero');
    }
}

module.exports = {
    xeroClient,
    requireXeroAuth,
    setTokenSet: (tokens) => { tokenSet = tokens; }
}; 