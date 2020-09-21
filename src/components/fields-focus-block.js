const template = document.createElement('template');
template.innerHTML = `
<div class="focus-options">
  <div>
    <h3 style="text-transform: uppercase;">Set Image Focus</h3>
  </div>
  <small>Use <a target="_blank" href="http://jonom.github.io/jquery-focuspoint/demos/helper/index.html">Helper Tool</a> to get image focus values</small>
</div>
<div class="focus-fields" style="display: flex; justify-content: space-evenly;">
  <div class="slds-form-element" style="width: 20%;">
    <label class="slds-form-element__label" for="lpHeader" style="text-align: center">
      Image Focus X Value
    </label>
    <div class="slds-form-element__control">
      <input type="text" id="dataFocusX" placeholder="X-Value" required="" class="slds-input" />
    </div>
  </div>
  <div class="slds-form-element" style="width: 20%;">
    <label class="slds-form-element__label" for="lpHeader" style="text-align: center;">
      Image Focus Y Value
    </label>
    <div class="slds-form-element__control">
      <input type="text" id="dataFocusY" placeholder="Y-Value" required="" class="slds-input" />
    </div>
  </div>
  <div class="slds-form-element" style="width: 20%;">
    <label class="slds-form-element__label" for="lpHeader" style="text-align: center;">
      Image Focus W Value
    </label>
    <div class="slds-form-element__control">
      <input type="text" id="dataFocusW" placeholder="W-Value" required="" class="slds-input" />
    </div>
  </div>
  <div class="slds-form-element" style="width: 20%;">
    <label class="slds-form-element__label" for="lpHeader" style="text-align: center;">
      Image Focus H Value
    </label>
    <div class="slds-form-element__control">
      <input type="text" id="dataFocusH" placeholder="H-Value" required="" class="slds-input" />
    </div>
  </div>
</div>
`;

class FieldsFocusBlock extends HTMLElement {
  constructor() {
    super();
    this.inputVal = '';
  }

  async connectedCallback() {
    this.appendChild(template.content.cloneNode(true));

    const inputs = this.querySelectorAll('input');
    [...inputs].forEach(input => {
      input.addEventListener('change', e => {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('change', {
          detail: {
            [e.currentTarget.id]: e.currentTarget.value
          },
          bubbles: true
        }));
      });
    });
  }
}

customElements.define('fields-focus-block', FieldsFocusBlock);