var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Test configuration */
router.get('/test-config', function (req, res, next) {
  const config = {
    everyware: {
      apiKey: process.env.EVERYWARE_API_KEY ? 'Configured' : 'Missing',
      username: process.env.EVERYWARE_USERNAME ? 'Configured' : 'Missing',
      baseURL: process.env.EVERYWARE_BASE_URL
    },
    xero: {
      clientId: process.env.XERO_CLIENT_ID ? 'Configured' : 'Missing',
      clientSecret: process.env.XERO_CLIENT_SECRET ? 'Configured' : 'Missing',
      redirectUri: process.env.XERO_REDIRECT_URI,
      scopes: process.env.XERO_SCOPES
    }
  };

  res.json(config);
});

module.exports = router;
