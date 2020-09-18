const template = document.createElement('template');
template.innerHTML = `
<div class="slds-form-element">
  <label class="slds-form-element__label" for="lpHeader">
    Landing Page Heading
  </label>
  <div class="slds-form-element__control">
    <input type="text" id="lpHeader" placeholder="Heading" required="" class="slds-input" />
  </div>
</div>
<div class="slds-form-element">
  <label class="slds-form-element__label" for="lpSubheader">
    Landing Page Subheading
  </label>
  <div class="slds-form-element__control">
    <input type="text" id="lpSubheader" placeholder="Subheading" required="" class="slds-input" />
  </div>
</div>
`;

class HeadingBlock extends HTMLElement {
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
    })
  }
}

customElements.define('heading-block', HeadingBlock);