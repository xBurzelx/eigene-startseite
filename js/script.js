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

  // Garantierte Fallback-Tabelle
  const fallbackData = [
    { teamName: "1. FC Lokomotive Leipzig", matches: 3, points: 7 },
    { teamName: "Hallescher FC", matches: 3, points: 7 },
    { teamName: "FC Carl Zeiss Jena", matches: 3, points: 6 },
    { teamName: "FC Rot-Weiß Erfurt", matches: 3, points: 6 },
    { teamName: "Chemnitzer FC", matches: 3, points: 5 },
    { teamName: "BFC Dynamo", matches: 3, points: 4 },
    { teamName: "VSG Altglienicke", matches: 3, points: 4 },
    { teamName: "BSG Chemie Leipzig", matches: 3, points: 4 },
    { teamName: "Greifswalder FC", matches: 3, points: 3 },
    { teamName: "FSV 63 Luckenwalde", matches: 3, points: 2 },
    { teamName: "ZFC Meuselwitz", matches: 3, points: 2 },
    { teamName: "Hertha BSC II", matches: 3, points: 1 }
  ];

  let data = null;

  try {
    const response = await fetch('https://api.openligadb.de/getbltable/rlno/2025');
    if (response.ok) {
      const json = await response.json();
      if (Array.isArray(json) && json.length > 3) {
        data = json;
      }
    }
  } catch (e) {
    console.log("API blockiert, lade Fallback-Daten.");
  }

  const tableData = (data && data.length > 0) ? data : fallbackData;

  tbody.innerHTML = '';

  tableData.forEach((team, index) => {
    const tr = document.createElement('tr');
    const teamName = team.teamName || team.TeamName || 'Unbekannt';
    const matches = team.matches ?? team.Matches ?? 0;
    const points = team.points ?? team.Points ?? 0;

    if (teamName.toLowerCase().includes('chemnitz')) {
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

// Initialisierung
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