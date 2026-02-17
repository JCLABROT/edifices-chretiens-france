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
  ${edifice.type} - ${edifice.confession}<br>
  <em>Cliquez à nouveau pour plus d'infos</em>
`);

marker.on("click", function() {

  document.getElementById("sidebarContent").innerHTML = `
    <h2>${edifice.nom}</h2>
    <p><strong>Commune :</strong> ${edifice.commune}</p>
    <p><strong>Type :</strong> ${edifice.type}</p>
    <p><strong>Confession :</strong> ${edifice.confession}</p>
    <p><strong>Latitude :</strong> ${edifice.lat}</p>
    <p><strong>Longitude :</strong> ${edifice.lon}</p>
  `;

  document.getElementById("sidebar").classList.add("open");
});

document.getElementById("closeSidebar").addEventListener("click", function() {
  document.getElementById("sidebar").classList.remove("open");
});
