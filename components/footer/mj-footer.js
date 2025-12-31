// logo-nav.js
class MJFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "/components/footer/mj-footer.css");

    const linkElemCommon = document.createElement("link");
    linkElemCommon.setAttribute("rel", "stylesheet");
    linkElemCommon.setAttribute("href", "/components/common.css");

    this.shadowRoot.innerHTML = `
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
      <footer>
      <div class="links">
        <div>
          <ul>
            <li><a href=/terms-conditions.html>Terms and Conditions</a></li>
          </ul>
          <ul>
            <li><a href=/privacy.html>Privacy Policy</a></li>
          </ul>
        </div> 
        <div class="social-links">
          <a href="https://instagram.com/mackenziejamesmedia" target="_blank" aria-label="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
        </div>
        <div class="contact">
          <ul>
              <li><a href="mailto:hello@mackenziejamesmedia.com">hello@mackenziejamesmedia.com</a></li>
              <li>(123) 456-7890</li>
          </ul>
        </div>
      </div>
      <div class="copyright">
        <p>&copy; 2026 Mackenzie James Media. All rights reserved.</p>
        <p>Website by <a href="https://mackenziejamesmedia.com" target="_blank" rel="noopener">Mackenzie James Media</a></p>
      </div>

      </footer>
    `;

    this.shadowRoot.prepend(linkElem);
    this.shadowRoot.prepend(linkElemCommon);
  }
}

// Register the custom element
customElements.define("mj-footer", MJFooter);
