// 1. UHRZEIT UND DATUM
function updateClock() {
  const now = new Date();
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeElem = document.getElementById('time');
  if (timeElem) timeElem.textContent = `${hours}:${minutes}`;

  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const dateElem = document.getElementById('date');
  if (dateElem) dateElem.textContent = now.toLocaleDateString('de-DE', options);
}

// 2. LIVE-WETTER (Chemnitz)
async function loadWeather() {
  const weatherElem = document.getElementById('weather');
  if (!weatherElem) return;

  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=50.8333&longitude=12.9167&current_weather=true');
    const data = await res.json();
    
    if (data && data.current_weather) {
      const temp = Math.round(data.current_weather.temperature);
      const code = data.current_weather.weathercode;

      let desc = "Klar";
      if (code >= 1 && code <= 3) desc = "Leicht bewölkt";
      else if (code >= 45 && code <= 48) desc = "Nebel";
      else if (code >= 51 && code <= 67) desc = "Regen";
      else if (code >= 71 && code <= 77) desc = "Schnee";
      else if (code >= 80 && code <= 82) desc = "Regenschauer";
      else if (code >= 95) desc = "Gewitter";

      weatherElem.textContent = `${temp}°C – ${desc}`;
    }
  } catch (e) {
    weatherElem.textContent = "Wetter derzeit nicht verfügbar";
  }
}

// 3. REGIONALLIGA NORDOST TABELLE
async function loadLeagueTable() {
  const tbody = document.getElementById('table-body');
  if (!tbody) return;

  // Verschiedene Mögliche OpenLigaDB-Kürzel & Saisons abfragen
  const apiUrls = [
    'https://api.openligadb.de/getbltable/rlno/2025',
    'https://api.openligadb.de/getbltable/rlno/2024',
    'https://api.openligadb.de/getbltable/rl-nordost/2025',
    'https://api.openligadb.de/getbltable/rl-nordost/2024'
  ];

  let data = null;

  for (const url of apiUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json) && json.length > 2) {
          data = json;
          break; // Erfolgreich vollständige Tabelle gefunden
        }
      }
    } catch (e) {
      console.warn('API-Versuch fehlgeschlagen:', url);
    }
  }

  if (!data) {
    tbody.innerHTML = '<tr><td colspan="4">Tabelle derzeit nicht erreichbar</td></tr>';
    return;
  }

  tbody.innerHTML = '';

  data.forEach((team, index) => {
    const tr = document.createElement('tr');
    const teamName = team.teamName || team.TeamName || 'Unbekannt';
    const matches = team.matches ?? team.Matches ?? 0;
    const points = team.points ?? team.Points ?? 0;

    const isCFC = teamName.toLowerCase().includes('chemnitz');

    if (isCFC) {
      tr.classList.add('cfc-row');
    }

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td class="team-name" title="${teamName}">${teamName}</td>
      <td>${matches}</td>
      <td>${points}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Skript-Startfunktion
function initApp() {
  updateClock();
  setInterval(updateClock, 1000);
  loadWeather();
  loadLeagueTable();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}