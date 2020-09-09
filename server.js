const express = require('express');
const session = require('express-session');
const { createProxyMiddleware } = require('http-proxy-middleware');
const port = process.env.PORT || 3000
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');
const request = require('request');
const EventEmitter = require('events').EventEmitter;
const fs = require('fs');
const https = require('https');

if (process.env.NODE_ENV === 'development') {
	require('dotenv').config();
}

const app = express();

// wherever this is hosted needs to have those
// environment variables set to the MC app values
// given to you by the app center page
const secret = process.env.APP_SIGNATURE;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const appID = process.env.APP_ID;
const authEmitter = new EventEmitter();

function waitForAuth(req, ttl) {
	console.log("IM WAITING FOR AUTH")
	return new Promise(function (resolve, reject) {
		const timeout = setTimeout(
			function () {
				console.log("IM REJECTING THE AUTH")
				removeListener();
				reject('auth timeout expired');
			},
			ttl
		);

		const listener = function (authData) {
			console.log("IM IN THE LISTENER")
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

		authEmitter.addListener('authed', listener);
	});
}

function verifyAuth(req, res, next) {
	console.log("IM IN THE VERIFY AUTH")

	if (req.session && req.session.accessToken) {
		console.log("I HAVE A SESSION IN AUTH")
		next();
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
// for the UI. The following code is storing sessions in memory
// for demo purposes and cannot be used for a prod setup.
// instead, use a persistent storage like redis or mongo
// with the session library
app.use(session({
	name: 'mcisv',
	secret: 'my-app-super-secret-session-token',
	cookie: {
		maxAge: 1000 * 60 * 60 * 24,
		secure: false
	},
	saveUninitialized: true,
	resave: false
}));

// app.use('/', express.static('dist'));
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
	console.log("WHEN AM I HITTING THIS")
	
	res.render('index', {
		app: JSON.stringify({
			appID,
			...req.params
		})
	});
});

// the code below proxies REST calls from the UI
// waits up to ten seconds for authentication, and then sends
// to the MC API, with the authorization header injected
app.use('/proxy',
	verifyAuth,
	createProxyMiddleware({
		logLevel: 'debug',
		changeOrigin: true,
		target: 'https://mc9-x13m9sbbt19l3fr2xbvxm8l1.com/',
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

// MC Oath will post to whatever URL you specify as the login URL
// in the app center when the uer opens the app. In our case /login
// the posted jwt has a refreshToken that we can use to get
// an access token. That access is used to authenticate MC API calls
app.post('/login', (req, res, next) => {
	console.log("IM NOT HITTING ThIS AM I")
	const encodedJWT = req.body.jwt;
	const decodedJWT = jwt.decode(encodedJWT, secret);
	const restInfo = decodedJWT.request.rest;
	// the call to the auth endpoint is done right away
	// for demo purposes. In a prod app, you will want to
	// separate that logic out and repeat this process
	// everytime the access token expires
	request.post(restInfo.authEndpoint, {
		form: {
			clientId: clientId,
			clientSecret: clientSecret,
			refreshToken: restInfo.refreshToken,
			accessType: 'offline'
		}
	}, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			const result = JSON.parse(body);
			// storing the refresh token is useless in the demo
			// but in a prod app it will be used next time we
			// want to refresh the access token
			req.session.refreshToken = result.refreshToken;
			// the access token below can authenticate
			// against the MC API
			req.session.accessToken = result.accessToken;
			req.session.save();
			authEmitter.emit('authed', {
				sessionID: req.sessionID,
				accessToken: result.accessToken
			});
		}
		// we redirect to the app homepage
		res.redirect('/');
		next();
	});
});

app.set('etag', false);
app.listen(port, () => console.log(`App listening on ${port}`));