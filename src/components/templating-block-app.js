import './templating-block-fieldset';
import './fields-block';
// import './imageSelector'

class TemplatingBlockApp extends HTMLElement {
	set fields(val) {
		this.fieldSet.fields = val;
	}

	connectedCallback() {
    const newSelector = document.createElement('image-selector');
    this.appendChild(newSelector);

		this.fieldSet = document.createElement('templating-block-fieldset');
		this.appendChild(this.fieldSet);

		this.fieldsBlock = document.createElement('fields-block');
		this.appendChild(this.fieldsBlock);

		// this.fieldSet.addEventListener('change', dispatchEvent('fields'));
	}
}

customElements.define('templating-block-app', TemplatingBlockApp);
