const express = require('express');
const session = require('express-session');
const { createProxyMiddleware } = require('http-proxy-middleware');
const port = process.env.PORT || 3000
const bodyParser = require('body-parser');
const EventEmitter = require('events').EventEmitter;
const fs = require('fs');
const https = require('https');
const axios = require('axios');

if (process.env.NODE_ENV === 'development') {
	require('dotenv').config();
}

const MongoDBStore = require('connect-mongodb-session')(session);

// CONNECTS TO THE MONGODB TO STORE THE TOKEN FOR AUTH REQUESTS TO SFMC
const store = new MongoDBStore(
	{
    uri: `mongodb+srv://salesforce:${process.env.DBPASSWORD}@salesforce.xgys7.mongodb.net/${process.env.DBUSER}?retryWrites=true&w=majority`,
		collection: 'mySessions'
	});

store.on('error', function(error) {
  console.log(error);
});

const app = express();

// wherever this is hosted needs to have those
// environment variables set to the MC app values
// given to you by the app center page
// THIS VALUES COME FROM THE API INTEGRATION PACKAGE THAT IS INSTALLED ON OUR SFMC SPECIFIC INSTANCE
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const appID = process.env.APP_ID;
const authEmitter = new EventEmitter();
const sess = {
	secret: process.env.COOKIE_SECRET,
	store,
	cookie: {
	 secure: false,
	 maxAge: 1000 * 60 * 18 // 18 minutes
	},
	resave: true,
  saveUninitialized: true
}

if (process.env.NODE_ENV === 'production') {
	app.set('trust proxy', 1);
	sess.cookie.secure = true;
}

// FUNCTION IS USED TO SET SESSION ACCESS TOKEN FOR AUTH REQUESTS TO SFMC CONTENT BUILDER
function waitForAuth(req, ttl) {
	return new Promise(function (resolve, reject) {
		const timeout = setTimeout(
			function () {
				removeListener();
				reject('auth timeout expired');
			},
			ttl
		);

    // IF THERE IS ALREADY A VALID ACCESS TOKEN AND SESSION CLEARS TIMERS AND LISTENERS
		if (req.session && req.session.accessToken) {
			clearTimeout();
			removeListener();
			resolve();
		}

    // VERIFYS THE SESSION ID IS CURRENT IF SO SETS THE ACCESS TOKEN TO THE SESSION AND RESOLVES PROMISE
		const listener = function (authData) {
			if (authData.sessionID === req.sessionID) {
				req.session.accessToken = authData.accessToken;
				clearTimeout(timeout);
				removeListener();
				resolve();
			}
		};

		const removeListener = function () {
			authEmitter.removeListener('authed', listener);
		};

    // LISTENS FOR THE 'authed' EVENT AND CALLS THE LISTENER FUNCTION TO SET THE ACCESS TOKEN TO THE SESSION FOR AUTH REQUESTS
		authEmitter.addListener('authed', listener);
	});
}

// MIDDLEWARE FUNCTION FOR VERIFYING IF VALID SESSION AND ACCESS TOKEN IF NOT ATTEMPTS TO CREATE AUTH SESSION AND TOKEN THROUGH 'waitForAuth' FUNCTION
function verifyAuth(req, res, next) {

	if (req.session && req.session.accessToken) {
		next();
		return;
	}

	waitForAuth(req, 10000)
		.then(next)
		.catch(function (error) { res.send(401); });
}

app.use(bodyParser.urlencoded({ extended: true }));

// session management: the UI won't authenticate and
// make calls to the MC API. Instead it keeps a session
// with the node layer here and sends calls to a node proxy
// that will authenticate against the MC and proxy API calls
// for the UI.
app.use(session(sess));

// CREATING USE FOR STATIC FILES IN CUSTOM CONTENT BLOCK USE
app.use('/public', express.static('dist'));
app.use('*/icon.png', express.static('dist/icon.png'));
app.use('*/dragIcon.png', express.static('dist/dragIcon.png'));
app.use('/assets', express.static('node_modules/@salesforce-ux/design-system/assets'));

app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get(['/', '/block/:assetId(\\d+)'], (req, res) => {	
	res.render('index', {
		app: JSON.stringify({
			appID,
			...req.params
		})
	});
});

app.use((req, res, next) => {
  // IF NO SESSION OR TOKEN MAKES A POST REQUEST TO API TOKEN ENDPOINT AND SETS ACCESS TOKEN TO SESSION AND EMITS 'authed' EVENT
  // WITH APPROPRIATE SESSION ID AND ACCESS TOKEN FOR USE IN THE waitForAuth FUNCTION ABOVE 
	if (!req.session || !req.session.accessToken) {
		axios({
			method: 'post',
			url: 'https://mc9-x13m9sbbt19l3fr2xbvxm8l1.auth.marketingcloudapis.com/v2/token',
			data: {
				grant_type: 'client_credentials',
				client_id: clientId,
				client_secret: clientSecret,
				account_id: 514000427
			}
		}).then((res) => {
			req.session.accessToken = res.data.access_token;
			authEmitter.emit('authed', {
				sessionID: req.sessionID,
				accessToken: res.data.access_token
			});
			next();
		}).catch(err => {
			console.log(err);
		});
	}
	
});

// the code below proxies REST calls from the UI
// waits up to ten seconds for authentication, and then sends
// to the MC API, with the authorization header injected
app.use('/proxy',
	verifyAuth,
	createProxyMiddleware({
		logLevel: 'debug',
		changeOrigin: true,
		target: 'https://mc9-x13m9sbbt19l3fr2xbvxm8l1.rest.marketingcloudapis.com/',
		onError: console.log,
		protocolRewrite: 'https',
		pathRewrite: {
			'^/proxy': ''
		},
		secure: false,
		onProxyReq: (proxyReq, req, res) => {
			if (!req.session || !req.session.accessToken) {
				res.send(401);
			}

			proxyReq.setHeader('Authorization', 'Bearer ' + req.session.accessToken);
			proxyReq.setHeader('Content-Type', 'application/json');
		},
	})
);

app.set('etag', false);
app.listen(port, () => console.log(`App listening on ${port}`));