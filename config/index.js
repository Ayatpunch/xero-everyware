require('dotenv').config();

// Everyware configuration
const everywareConfig = {
    apiKey: process.env.EVERYWARE_API_KEY,
    username: process.env.EVERYWARE_USERNAME,
    baseURL: process.env.EVERYWARE_BASE_URL
};

// Xero configuration
const xeroConfig = {
    clientId: process.env.XERO_CLIENT_ID,
    clientSecret: process.env.XERO_CLIENT_SECRET,
    redirectUri: process.env.XERO_REDIRECT_URI,
    scopes: process.env.XERO_SCOPES
};

module.exports = {
    everywareConfig,
    xeroConfig,
    port: process.env.PORT || 5005
};
