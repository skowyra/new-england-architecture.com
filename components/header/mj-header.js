// logo-nav.js
class MJHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "/components/header/mj-header.css");

    this.shadowRoot.innerHTML = `
      <header>
        <div class="title">
          <div class="logo"><img src="https://mackenziejames.nyc3.cdn.digitaloceanspaces.com/marketing/Logos/MackenzieJamesStudioTriangleAboveLogo.jpg" alt="Mackenzie James Media"/></div>
        </div>
        <div class="navigation">
          <button class="hamburger" aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="portfolio.html">Portfolio</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </nav>
        </div>
        <div class="contact-info">
          <div><a href="mailto:jim@mackenziejamesstudio.com">jim@mackenziejamesstudio.com</a></div>
          <div>413-515-2346</div>
        </div>
        
      </header>
     
    `;

    this.shadowRoot.prepend(linkElem);

    // Add event listener AFTER DOM is created
    const hamburger = this.shadowRoot.querySelector(".hamburger");
    const navMenu = this.shadowRoot.querySelector("nav ul");

    hamburger?.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu?.classList.toggle("active");
    });
  }
}

// Register the custom element
customElements.define("mj-header", MJHeader);
