class MJCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const title = this.getAttribute('title') || '';
    const text = this.getAttribute('text') || '';

    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '/components/card/mj-card.css');

    this.shadowRoot.innerHTML = `
      <div class="card">
        <h3>${title}</h3>
        <p>${text}</p>
      </div>
    `;

    this.shadowRoot.prepend(linkElem);
  }
}

customElements.define('mj-card', MJCard);
