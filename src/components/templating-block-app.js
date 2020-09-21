import './templating-block-fieldset';
import './fields-form-block';
import './fields-focus-block';
class TemplatingBlockApp extends HTMLElement {
	set fields(val) {
		this.fieldSet.fields = val;
	}

	connectedCallback() {
    const imageSelectorBlock = document.createElement('image-selector-block');
		this.appendChild(imageSelectorBlock);
		
		const fieldsFocusBlock = document.createElement('fields-focus-block');
		this.appendChild(fieldsFocusBlock);

		// this.fieldSet = document.createElement('templating-block-fieldset');
		// this.appendChild(this.fieldSet);

		const fieldsFormBlock = document.createElement('fields-form-block');
		this.appendChild(fieldsFormBlock);

		// this.fieldSet.addEventListener('change', dispatchEvent('fields'));
	}
}

customElements.define('templating-block-app', TemplatingBlockApp);
