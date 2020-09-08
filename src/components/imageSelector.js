
const template = document.createElement('template');
template.innerHTML = `
<div class="slds-form-element">
  <span class="slds-form-element__label" id="file-selector-primary-label">Attachment</span>
  <div class="slds-file-selector slds-file-selector_images">
  <div class="slds-file-selector__dropzone">
    <input type="file" class="slds-file-selector__input slds-assistive-text" accept="image/png" id="file-upload-input-01" aria-labelledby="file-selector-primary-label file-selector-secondary-label" />
    <label class="slds-file-selector__body" for="file-upload-input-01" id="file-selector-secondary-label">
      <span class="slds-file-selector__button slds-button slds-button_neutral">
        <svg class="slds-button__icon slds-button__icon_left" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#upload"></use>
        </svg>Upload Image</span>
      <span class="slds-file-selector__text slds-medium-show">or Drop Image</span>
    </label>
  </div>
</div>
`;

class ImageSelector extends HTMLElement {
	constructor () {
		super();

		this._toggleSelector = this._toggleSelector.bind(this);
	}

	async connectedCallback() {
		this.appendChild(template.content.cloneNode(true));
		this.grid = this.getElementsByClassName('slds-form-element')[0];

		this.getElementsByTagName('button')[0].addEventListener('click', this._toggleSelector);
    this.addEventListener('change', evt => {
      var tgt = evt.target || window.event.srcElement,
      files = tgt.files;

      // FileReader support
      if (FileReader && files && files.length) {
          var fr = new FileReader();
          fr.onload = function () {

              // document.getElementById(outImage).src = fr.result;
          }
          fr.readAsDataURL(files[0]);
      }
      
			this.value = evt.detail.value;
			this._toggleSelector();
    });

		const images = await getImages();
		this.grid.innerHTML = images.items.map(this._getImageHTML).join('');
	}

	_getImageHTML(image) {
		return `
<div class="slds-col slds-size_1-of-2 slds-p-top_x-small">
	<image-card id="${image.id}" name="${image.name}" url="${image.fileProperties.publishedURL}"></image-card>
</div>
		`;
	}

	_toggleSelector() {
		this.grid.style.display = this.grid.style.display === 'none' ? 'flex' : 'none';
	}
}

customElements.define('image-selector', ImageSelector);
