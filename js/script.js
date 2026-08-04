// --- UHRZEIT & DATUM ---
function updateClock() {
  const now = new Date();
  document.getElementById('time').textContent = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('date').textContent = now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
}
setInterval(updateClock, 1000);
updateClock();

// --- WETTER & STADT ABFRAGEN ---
async function fetchData(latitude, longitude) {
  try {
    // 1. Wetterdaten laden
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const weatherData = await weatherRes.json();

    // 2. Stadtnamen laden
    const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=de`);
    const geoData = await geoRes.json();

    // 3. Werte in das HTML einfügen
    const temp = Math.round(weatherData.current_weather.temperature);
    const city = geoData.city || geoData.locality || "Chemnitz";

    const locationEl = document.getElementById('location');
    const weatherEl = document.getElementById('weather');

    if (locationEl) locationEl.textContent = `📍 ${city}`;
    if (weatherEl) weatherEl.textContent = `🌡️ ${temp}°C`;

  } catch (e) {
    console.error("Fehler beim Laden der Wetterdaten:", e);
    const weatherEl = document.getElementById('weather');
    if (weatherEl) weatherEl.textContent = 'Wetter derzeit nicht verfügbar';
  }
}

// --- STANDORT-ERMITTLUNG MIT FALLBACK (CHEMNITZ) ---
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (pos) => fetchData(pos.coords.latitude, pos.coords.longitude),
    () => fetchData(50.8333, 12.9167) // Fallback bei Ablehnung
  );
} else {
  fetchData(50.8333, 12.9167); // Fallback falls Geolocation im Browser deaktiviert ist
}