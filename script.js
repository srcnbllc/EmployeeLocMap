// Harita başlangıç ayarları
var map = L.map("map").setView([41.015137, 28.97953], 10); // İstanbul

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
}).addTo(map);

var personelKoordinatlari = [];

// Personel ekleme fonksiyonu
function personelEkle() {
    var isim = document.getElementById("personelIsim").value;
    var ikametEnlem = parseFloat(document.getElementById("ikametEnlem").value);
    var ikametBoylam = parseFloat(document.getElementById("ikametBoylam").value);
    var calismaEnlem = parseFloat(document.getElementById("calismaEnlem").value);
    var calismaBoylam = parseFloat(document.getElementById("calismaBoylam").value);

    if (!isim || isNaN(ikametEnlem) || isNaN(ikametBoylam) || isNaN(calismaEnlem) || isNaN(calismaBoylam)) {
        alert("Lütfen tüm alanları doldurun.");
        return;
    }

    var personel = {
        isim: isim,
        ikamet: [ikametEnlem, ikametBoylam],
        calisma: [calismaEnlem, calismaBoylam],
    };

    personelKoordinatlari.push(personel);

    // Personel listesini güncelle
    var tableBody = document.getElementById("personelTableBody");
    var row = document.createElement('tr');
    var mesafe = map.distance(L.latLng(personel.ikamet), L.latLng(personel.calisma)) / 1000; // km cinsinden
    row.innerHTML = `<td>${personel.isim}</td>
                     <td>${mesafe.toFixed(2)} km</td>
                     <td><button onclick="personelSil(${personelKoordinatlari.length - 1})">Sil</button></td>`;
    tableBody.appendChild(row);

    // Formu temizle
    document.getElementById("personelIsim").value = '';
    document.getElementById("ikametEnlem").value = '';
    document.getElementById("ikametBoylam").value = '';
    document.getElementById("calismaEnlem").value = '';
    document.getElementById("calismaBoylam").value = '';
}

// Mesafe bilgilerini harita üzerinde göstermek için fonksiyon
function mesafeBilgisi(ortaNokta, mesafe) {
    var mesafeLabel = document.createElement("div");
    mesafeLabel.classList.add("mesafe-label");
    mesafeLabel.innerHTML = `${mesafe.toFixed(2)} km`;

    var latLng = map.latLngToContainerPoint(ortaNokta);  // Koordinatları piksel cinsine çevir

    // Mesafe bilgisini harita üzerinde göstermek için doğru konumda yerleştir
    mesafeLabel.style.position = "absolute";
    mesafeLabel.style.left = `${latLng.x}px`;
    mesafeLabel.style.top = `${latLng.y - 25}px`;  // Çizginin biraz üstüne yerleştiriyoruz

    // Mesafe bilgisini harita üzerine ekle
    document.getElementById("map").appendChild(mesafeLabel);
}

// Personel silme fonksiyonu
function personelSil(index) {
    personelKoordinatlari.splice(index, 1);
    goster();  // Yeniden göster
}

// Personel bilgilerini harita üzerinde göstermek için fonksiyon
function goster() {
    // Haritayı temizle
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Personel verilerini harita üzerinde göster
    personelKoordinatlari.forEach(function(personel) {
        var ikametMarker = L.marker(personel.ikamet).addTo(map)
            .bindPopup(`<b>${personel.isim}</b><br>İkametgah`);

        var calismaMarker = L.marker(personel.calisma).addTo(map)
            .bindPopup(`<b>${personel.isim}</b><br>Çalışma Adresi`);

        var mesafe = map.distance(L.latLng(personel.ikamet), L.latLng(personel.calisma)) / 1000;  // km

        // Mesafe bilgisini göster
        mesafeBilgisi(L.latLng(personel.ikamet), mesafe);
    });
}
