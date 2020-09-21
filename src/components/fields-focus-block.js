const template = document.createElement('template');
template.innerHTML = `
<div class="focus-options">
  <div>
    <h3 style="text-transform: uppercase;">Set Image Focus</h3>
  </div>
  <small>Use <a target="_blank" href="http://jonom.github.io/jquery-focuspoint/demos/helper/index.html">Helper Tool</a> to get image focus values</small>
</div>
<div class="focus-fields">
  <div class="slds-form-element">
    <label class="slds-form-element__label" for="lpHeader">
      Image Focus
    </label>
    <div class="slds-form-element__control">
      <input type="text" id="dataFocusInput" required="" class="slds-input" />
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


    const input = this.querySelector('input');
    input.addEventListener('change', e => {
      const positionValues = e.currentTarget.value.split(' ');
      const focusVals = {};
      positionValues.map( positionValue => focusVals[positionValue.match(/(data-.+)=/).slice(-1)[0]] = positionValue.match(/"(.+)"/).slice(-1)[0])
      debugger
      e.stopPropagation();
      debugger
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          focusVals
        },
        bubbles: true
      }));
    });
  }
}

customElements.define('fields-focus-block', FieldsFocusBlock);