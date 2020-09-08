const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const bodyParser = require('body-parser');

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
	res.render('index', {
		app: JSON.stringify({
			...req.params
		})
	});
});

app.set('etag', false);
app.listen(port, () => console.log(`App listening on ${port}`));