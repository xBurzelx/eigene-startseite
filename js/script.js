// Function zum Laden der Regionalliga Nordost Tabelle
async function loadLeagueTable() {
  const tbody = document.getElementById('table-body');
  if (!tbody) return;

  try {
    const response = await fetch('https://api.openligadb.de/getbltable/rlno/2025');
    const data = await response.json();

    tbody.innerHTML = '';

    data.forEach((team, index) => {
      const tr = document.createElement('tr');
      const isCFC = team.teamName.toLowerCase().includes('chemnitz');

      if (isCFC) {
        tr.classList.add('cfc-row');
      }

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td class="team-name" title="${team.teamName}">${team.teamName}</td>
        <td>${team.matches}</td>
        <td>${team.points}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4">Tabelle derzeit nicht verfügbar</td></tr>';
  }
}

// Beim Laden der Seite ausführen
document.addEventListener('DOMContentLoaded', () => {
  loadLeagueTable();
});