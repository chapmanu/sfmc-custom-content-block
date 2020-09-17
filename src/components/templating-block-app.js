import './templating-block-fieldset';
import './heading-block';
// import './imageSelector'

class TemplatingBlockApp extends HTMLElement {
	set fields(val) {
		this.fieldSet.fields = val;
	}

	connectedCallback() {
		// const dispatchEvent = type => e => {
		// 	debugger
		// 	return this.dispatchEvent(new CustomEvent('change', {
		// 		detail: {
		// 			...e.detail,
		// 			type: type
		// 		},
		// 		bubbles: false
		// 	}));
		// }


		// not using shadow DOM to avoid loading SLDS styles _everywhere_
		// if (!this.locked) {
		// 	const selector = document.createElement('templating-block-selector');
		// 	selector.assetId = this.assetId;
		// 	this.appendChild(selector);
		// 	selector.addEventListener('change', dispatchEvent('template'));
    // }
    
    const newSelector = document.createElement('image-selector');
    this.appendChild(newSelector);

		this.fieldSet = document.createElement('templating-block-fieldset');
		this.appendChild(this.fieldSet);

		this.headingBlock = document.createElement('heading-block');
		this.appendChild(this.headingBlock);

		// this.fieldSet.addEventListener('change', dispatchEvent('fields'));
	}
}

customElements.define('templating-block-app', TemplatingBlockApp);
