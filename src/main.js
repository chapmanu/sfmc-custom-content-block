import './components/templating-block-app';
import SDK from 'blocksdk';
import { getHtml, parseTemplate } from './lib/templating-block-utils';
import { getBlock } from './lib/api';
import { FocusedImage } from "image-focus"

// SSL OVERRIDE IS SET TO TRUE MEANING USE FOR LOCAL DEV
// TODO: SET TO FALSE FOR PRODUCTION?
const sdk = new SDK(null, null, true);

function initializeApp(data) {
	const app = document.createElement('templating-block-app');
	app.locked = data.locked;
	if (data.template) {
		app.assetId = data.template.id;
	}

	// respond to app changes
	app.addEventListener('change', e => {
		// always get current data
		sdk.getData(blockData => {
			const newBlockData = {
				...blockData,
				...e.detail
			};

			setEverything(newBlockData);
		});
	});

	document.getElementById('workspace').appendChild(app);
}

function setEverything(data) {
	// always set data with latest
	sdk.setData(data);
	// set content with latest changes
	sdk.setContent(getHtml(data));
	// update preview to use latest, with placeholders for preview
	sdk.setSuperContent(getHtml(data));
}

sdk.getData(async (data) => {
	initializeApp(data);
});
