const map = L.map('map').setView([46.6, 2.5], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// =============================
// Couleur selon confession
// =============================
function getColor(confession) {
  switch(confession) {
    case "catholique": return "blue";
    case "protestant": return "orange";
    case "orthodoxe": return "purple";
    default: return "gray";
  }
}

let edifices = [];

function showNotification(message, duration = 2000) {
  const notif = document.getElementById("notification");
  notif.textContent = message;
  notif.classList.add("show");

  setTimeout(() => {
    notif.classList.remove("show");
  }, duration);
}
// =============================
// Afficher les édifices
// =============================
function afficherEdifices(liste) {

  liste.forEach(edifice => {

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
      <em>Cliquez à nouveau pour voir la fiche</em>
    `);

    let clickCount = 0;

    marker.on("click", function() {

      clickCount++;

      if (clickCount === 1) {
        marker.openPopup();
        setTimeout(() => { clickCount = 0; }, 400);
      } 
      else if (clickCount === 2) {

        document.getElementById("sidebarContent").innerHTML = `
          <h2>${edifice.nom}</h2>
          <p><strong>Commune :</strong> ${edifice.commune}</p>
          <p><strong>Type :</strong> ${edifice.type}</p>
          <p><strong>Confession :</strong> ${edifice.confession}</p>
          <p><strong>Latitude :</strong> ${edifice.lat}</p>
          <p><strong>Longitude :</strong> ${edifice.lon}</p>
        `;

        document.getElementById("sidebar").classList.add("open");
        clickCount = 0;
      }

    });

  });

}

// =============================
// Chargement initial
// =============================
fetch('data/edifices.json')
  .then(response => response.json())
  .then(data => {

    edifices = data;

    const saved = localStorage.getItem("edificesAjoutes");
    if (saved) {
      edifices = edifices.concat(JSON.parse(saved));
    }

    afficherEdifices(edifices);

  })
  .catch(error => console.error("Erreur :", error));

// =============================
// Fermeture sidebar
// =============================
document.getElementById("closeSidebar")
  .addEventListener("click", function() {
    document.getElementById("sidebar").classList.remove("open");
  });

// =============================
// Mode ajout
// =============================
let addMode = false;

const addButton = document.getElementById("addButton");

addButton.addEventListener("click", function() {

  addMode = !addMode;
  addButton.classList.toggle("active");

  if (addMode) {
    showNotification("Cliquez sur l’emplacement de la carte pour ajouter un édifice.");
  }

});

map.on("click", function(e) {

  if (!addMode) return;

  const lat = e.latlng.lat;
  const lon = e.latlng.lng;

  document.getElementById("sidebarContent").innerHTML = `
    <h2>Ajouter un édifice</h2>

    <label>Nom :</label>
    <input type="text" id="formNom"><br><br>

    <label>Commune :</label>
    <input type="text" id="formCommune"><br><br>

    <label>Type :</label>
    <select id="formType">
      <option value="eglise">Église</option>
      <option value="cathedrale">Cathédrale</option>
      <option value="temple">Temple</option>
      <option value="abbaye">Abbaye</option>
      <option value="chapelle">Chapelle</option>
    </select><br><br>

    <label>Confession :</label>
    <select id="formConfession">
      <option value="catholique">Catholique</option>
      <option value="protestant">Protestant</option>
      <option value="orthodoxe">Orthodoxe</option>
    </select><br><br>

    <button id="saveEdifice">Ajouter</button>
  `;

  document.getElementById("sidebar").classList.add("open");

  document.getElementById("saveEdifice")
    .addEventListener("click", function() {

      const nom = document.getElementById("formNom").value;
      const commune = document.getElementById("formCommune").value;
      const type = document.getElementById("formType").value;
      const confession = document.getElementById("formConfession").value;

      if (!nom || !commune) {
        alert("Merci de remplir les champs obligatoires.");
        return;
      }

      const nouvelEdifice = {
        id: Date.now(),
        nom,
        commune,
        type,
        confession,
        lat,
        lon
      };

      edifices.push(nouvelEdifice);

      const dejaSauvegardes = localStorage.getItem("edificesAjoutes");
      let listeLocale = dejaSauvegardes ? JSON.parse(dejaSauvegardes) : [];
      listeLocale.push(nouvelEdifice);
      localStorage.setItem("edificesAjoutes", JSON.stringify(listeLocale));

      map.eachLayer(layer => {
        if (layer instanceof L.CircleMarker) {
          map.removeLayer(layer);
        }
      });

      afficherEdifices(edifices);

      document.getElementById("sidebar").classList.remove("open");
      addMode = false;
      addButton.classList.remove("active");
    });

});
});
