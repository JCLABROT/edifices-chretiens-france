const map = L.map('map').setView([46.6, 2.5], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Fonction pour définir la couleur selon la confession
function getColor(confession) {
  switch(confession) {
    case "catholique":
      return "blue";
    case "protestant":
      return "orange";
    case "orthodoxe":
      return "purple";
    default:
      return "gray";
  }
}

// Charger les édifices
fetch('data/edifices.json')
  .then(response => response.json())
  .then(data => {

    data.forEach(edifice => {

      const marker = L.circleMarker(
        [edifice.lat, edifice.lon],
        {
          radius: 8,
          fillColor: getColor(edifice.confession),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }
      ).addTo(map);

      marker.bindPopup(`
        <strong>${edifice.nom}</strong><br>
        ${edifice.commune}<br>
        ${edifice.type} - ${edifice.confession}
      `);

    });

  })
  .catch(error => console.error("Erreur :", error));

