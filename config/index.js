require('dotenv').config();

/**
 * @module config
 * @description Application configuration management loading from environment variables
 */

/**
 * @typedef {Object} EverywareConfig
 * @property {string} apiKey - Everyware API key
 * @property {string} username - Everyware username
 * @property {string} baseURL - Everyware API base URL
 */

/**
 * @typedef {Object} XeroConfig
 * @property {string} clientId - Xero OAuth2 client ID
 * @property {string} clientSecret - Xero OAuth2 client secret
 * @property {string} redirectUri - OAuth2 redirect URI
 * @property {string} scopes - Space-separated OAuth2 scopes
 */

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
