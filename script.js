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

function mesafeBilgisi(ortaNokta, mesafe) {
    // Harita üzerinde gösterilecek mesafe bilgisini içeren div
    var mesafeLabel = document.createElement("div");
    mesafeLabel.classList.add("mesafe-label");
    mesafeLabel.innerHTML = `${mesafe.toFixed(2)} km`;

    // Harita üzerindeki koordinatları piksel koordinatına çevir
    var latLng = ortaNokta; // Koordinat zaten latLng formatında olduğundan dönüşüme gerek yok

    // Mesafe etiketini bir divIcon olarak harita üzerine ekle
    var mesafeIcon = L.divIcon({
        className: 'mesafe-icon',
        html: mesafeLabel.outerHTML,  // HTML içeriğini buraya ekliyoruz
        iconSize: [100, 30],  // Mesafe etiketinin boyutlarını ayarlayın
    });

    // Mesafe bilgisini gösteren bir marker ekleyin
    var marker = L.marker(latLng, { icon: mesafeIcon }).addTo(map);
}

    // Konumu çizginin biraz üstüne yerleştir
    mesafeLabel.style.position = "absolute";
    mesafeLabel.style.left = `${latLng.x}px`;
    mesafeLabel.style.top = `${latLng.y - 25}px`;  // Çizginin biraz üstüne yerleştiriyoruz (25px yukarı)

    // Mesafe bilgisini harita üzerine ekle
    document.getElementById("map").appendChild(mesafeLabel);


// Gösterme ve harita üzerine ekleme işlemi
function goster() {
    // Haritayı temizle
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.Popup) {
            map.removeLayer(layer);
        }
    });

    var bounds = [];

    // Personel listesine güncellenmiş veriyi ekle
    personelKoordinatlari.forEach(function (personel, index) {
        // İkametgah ve Çalışma adresini haritada göster
        var ikametMarker = L.marker(personel.ikamet).addTo(map).bindPopup(personel.isim + ' (İkametgah)');
        var calismaMarker = L.marker(personel.calisma).addTo(map).bindPopup(personel.isim + ' (Çalışma Adresi)');

        // Renkler için bir dizi oluştur
        var renkler = ['red', 'blue', 'green', 'purple', 'orange', 'brown', 'pink', 'gray', 'cyan', 'magenta'];
        var renk = renkler[index % renkler.length];

        // Çizgiyi ekle
        var polyline = L.polyline([personel.ikamet, personel.calisma], {
            color: renk,
            weight: 3,
            opacity: 0.7,
        }).addTo(map);

        // Mesafeyi hesapla
        var mesafe = map.distance(L.latLng(personel.ikamet), L.latLng(personel.calisma)) / 1000; // km cinsinden
        var ortaNokta = [
            (personel.ikamet[0] + personel.calisma[0]) / 2,
            (personel.ikamet[1] + personel.calisma[1]) / 2,
        ];

        // Mesafeyi çizgi ortasında sabit olarak göster
        mesafeBilgisi(ortaNokta, mesafe);

        // Harita sınırlarını ayarlamak için koordinatları bir arada tut
        bounds.push(personel.ikamet, personel.calisma);
    });

    // Haritayı zoomlayarak tüm konumları göster
    map.fitBounds(bounds);

    // Haritayı görüntülenebilir yap
    document.getElementById("mapContainer").style.display = "block";
}

// Personel silme fonksiyonu
function personelSil(index) {
    personelKoordinatlari.splice(index, 1);
    goster(); // Listeyi güncelle
}
map.on('moveend', function() {
    marker.setLatLng(ortaNokta);  // Harita hareket ettiğinde mesafe etiketini güncelle
});
