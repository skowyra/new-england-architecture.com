class MJCalendar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.events = [];
    this.currentDate = new Date();
  }

  async connectedCallback() {
    // Create and append link element first
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/components/calendar/mj-calendar.css';
    this.shadowRoot.appendChild(link);

    // Show loading state
    const loading = document.createElement('div');
    loading.textContent = 'Loading calendar...';
    loading.style.padding = '2rem';
    loading.style.textAlign = 'center';
    this.shadowRoot.appendChild(loading);

    try {
      await this.loadGoogleAPI();
      await this.fetchEvents();
      this.render();
    } catch (error) {
      console.error('Calendar error:', error);
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.appendChild(link);
      const errorDiv = document.createElement('div');
      errorDiv.textContent = 'Error loading calendar. Please check console.';
      errorDiv.style.padding = '2rem';
      errorDiv.style.color = 'red';
      this.shadowRoot.appendChild(errorDiv);
    }
  }

  loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      if (window.gapi && window.gapi.client) {
        console.log('Google API already loaded');
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        console.log('Google API script loaded');
        gapi.load('client', async () => {
          try {
            await gapi.client.init({
              apiKey: CALENDAR_CONFIG.apiKey,
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            });
            console.log('Google API client initialized');
            resolve();
          } catch (error) {
            console.error('Failed to initialize Google API client:', error);
            reject(error);
          }
        });
      };
      script.onerror = (error) => {
        console.error('Failed to load Google API script:', error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  }

  async fetchEvents() {
    try {
      console.log('Fetching events from calendar:', CALENDAR_CONFIG.calendarId);
      const response = await gapi.client.calendar.events.list({
        calendarId: CALENDAR_CONFIG.calendarId,
        timeMin: new Date().toISOString(),
        maxResults: 50,
        singleEvents: true,
        orderBy: 'startTime',
      });
      this.events = response.result.items || [];
      console.log('Events fetched:', this.events.length);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  render() {
    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    // Keep the link element
    const link = this.shadowRoot.querySelector('link');
    this.shadowRoot.innerHTML = '';
    if (link) {
      this.shadowRoot.appendChild(link);
    }

    const calendar = document.createElement('div');
    calendar.className = 'calendar';
    calendar.innerHTML = `
      <div class="calendar-header">
        <button class="nav-btn" id="prev">&lt;</button>
        <h2>${monthNames[month]} ${year}</h2>
        <button class="nav-btn" id="next">&gt;</button>
      </div>
      <div class="calendar-grid">
        <div class="day-name">Sun</div>
        <div class="day-name">Mon</div>
        <div class="day-name">Tue</div>
        <div class="day-name">Wed</div>
        <div class="day-name">Thu</div>
        <div class="day-name">Fri</div>
        <div class="day-name">Sat</div>
        ${this.generateDays(firstDay, daysInMonth, month, year)}
      </div>
    `;

    this.shadowRoot.appendChild(calendar);

    this.shadowRoot.getElementById('prev').addEventListener('click', () => this.changeMonth(-1));
    this.shadowRoot.getElementById('next').addEventListener('click', () => this.changeMonth(1));
  }

  generateDays(firstDay, daysInMonth, month, year) {
    let html = '';
    
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      html += '<div class="day empty"></div>';
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasEvent = this.events.some(event => 
        event.start.date === dateStr || event.start.dateTime?.startsWith(dateStr)
      );
      
      html += `<div class="day ${hasEvent ? 'has-event' : ''}">${day}</div>`;
    }

    return html;
  }

  changeMonth(direction) {
    this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    this.fetchEvents().then(() => this.render());
  }
}

customElements.define('mj-calendar', MJCalendar);