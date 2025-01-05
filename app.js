var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

// Initialize SDKs
const {
  PaymentService,
  CustomerService
} = require('everyware-sdk');

const { AccountingApi } = require('xero-node');
const { everywareConfig } = require('./config');

// Initialize Everyware services
const paymentService = new PaymentService(everywareConfig);
const customerService = new CustomerService(everywareConfig);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var webhooksRouter = require('./routes/webhooks');
const invoicesRouter = require('./routes/invoices');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Xero callback route needs to be before other routes
app.get('/callback', async (req, res) => {
  try {
    const { xeroClient, setTokenSet } = require('./middleware/auth');
    console.log('Callback URL:', req.url);
    const tokenSet = await xeroClient.apiCallback(req.url);

    // First set the token
    await xeroClient.setTokenSet(tokenSet);
    // Then store it
    setTokenSet(tokenSet);

    res.redirect('/auth/test');
  } catch (error) {
    console.error('Xero Callback Error:', error);
    console.error('Error details:', error.response?.data || error.message);
    res.status(500).send('Authentication callback failed');
  }
});

// Register routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/webhooks', webhooksRouter);
app.use('/invoices', invoicesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
