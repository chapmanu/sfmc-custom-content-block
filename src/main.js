import './components/templating-block-app';
// import './components/imageSelector';
import SDK from 'blocksdk';
import { getHtml, parseTemplate } from './lib/templating-block-utils';
import { getBlock } from './lib/api';

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
			const newBlockData = blockData;

			// extend current data with new data
			switch (e.detail.type) {
				case 'template':
					newBlockData.template = e.detail.template;
					newBlockData.fields = parseTemplate(newBlockData.template);
					app.fields = newBlockData.fields;
					break;
				case 'fields':
					newBlockData.fields = e.detail.fields;
					break;
				default:
					break;
			}

			setEverything(newBlockData);
		});
	});

	document.getElementById('workspace').appendChild(app);
	app.fields = data.fields;
}

function setEverything(data) {
	// always set data with latest
	sdk.setData(data);
	// set content with latest changes
	sdk.setContent(getHtml(data.template, data.fields, false));
	// update preview to use latest, with placeholders for preview
	sdk.setSuperContent(getHtml(data.template, data.fields, true));
}

sdk.getData(async (data) => {
	if (window.app.assetId) {
		const overrideData = await getOverrideData(data, window.app.assetId);
		setEverything(overrideData);
	}
	
	initializeApp(data);
});

// sdk.triggerAuth(window.app.appID);