// logo-nav.js
class MJHeader extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })

    const linkElem = document.createElement('link')
    linkElem.setAttribute('rel', 'stylesheet')
    linkElem.setAttribute('href', '/components/header/mj-header.css')

    this.shadowRoot.innerHTML = `
      <header>
      <div class="title">
          <div class="logo"><img src="https://mackenziejames.nyc3.cdn.digitaloceanspaces.com/images/MackenzieJamesMediaBlackTriangleLogoPlain.jpg" alt="Mackenzie James Media"/></div>
        </div>
        <div class="navigation">
          <nav>
            <ul>
              <li><a href="/home.html">Home</a></li>
              <li><a href="/home.html#portfolio">Portfolio</a></li>
              <li><a href="/home.html#services">Services</a></li>
              <li><a href="/home.html#about">About</a></li>
              <li><a href="/home.html#contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>
    `

    this.shadowRoot.prepend(linkElem)
  }
}

// Register the custom element
customElements.define('mj-header', MJHeader)
