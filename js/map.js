const map = L.map('map').setView([46.6, 2.5], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Charger les édifices depuis le fichier JSON
fetch('data/edifices.json')
  .then(response => response.json())
  .then(data => {

    data.forEach(edifice => {

      const marker = L.marker([edifice.lat, edifice.lon]).addTo(map);

      marker.bindPopup(`
        <strong>${edifice.nom}</strong><br>
        ${edifice.commune}<br>
        ${edifice.type} - ${edifice.confession}
      `);

    });

  })
  .catch(error => console.error("Erreur de chargement :", error));
