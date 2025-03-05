// Harita başlangıç ayarları
var map = L.map("map").setView([41.0082, 28.9784], 13); // İstanbul

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
}).addTo(map);

var personelKoordinatlari = [];
var pins = [];
var polylines = [];

// Harita üzerinde tıklama ile pin ekleme
map.on('click', function(e) {
    if (pins.length < 2) {
        var pin = L.marker(e.latlng).addTo(map);
        pins.push(pin);

        // Eğer iki pin varsa, mesafeyi hesapla
        if (pins.length === 2) {
            hesaplaMesafe();
        }
    } else {
        // Yeni bir çift pin için önceki pinleri temizle
        pins.forEach(pin => map.removeLayer(pin));
        pins = [];

        // Yeni pin ekle
        var pin = L.marker(e.latlng).addTo(map);
        pins.push(pin);
    }
});

// Mesafeyi hesapla ve çizgi ekle
function hesaplaMesafe() {
    if (pins.length === 2) {
        var latlngs = pins.map(pin => pin.getLatLng());
        
        // Yeni çizgiyi ekle
        var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
        polylines.push(polyline);

        // Toplam mesafeyi hesapla
        var totalDistance = map.distance(latlngs[0], latlngs[1]) / 1000; // km cinsinden

        // Çizgi üzerine mesafe bilgisini ekle
        polyline.bindTooltip('Mesafe: ' + totalDistance.toFixed(2) + ' km', {
            permanent: true,
            className: 'distance-tooltip',
            offset: [0, 0],
            direction: 'center'
        }).openTooltip();

        // Personel listesine ekle
        var tableBody = document.getElementById('personelTableBody');
        var row = tableBody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);

        cell1.innerHTML = '<input type="text" placeholder="Personel Adı">';
        cell2.innerHTML = totalDistance.toFixed(2) + ' km';
        cell3.innerHTML = latlngs[0].lat.toFixed(5);
        cell4.innerHTML = latlngs[0].lng.toFixed(5);
        cell5.innerHTML = '<button onclick="satirSil(this)">Sil</button>';

        // Satır ve pin ilişkisini kur
        row.pins = [...pins];
        row.polyline = polyline;

        // Personel ekleme işlemi
        var isim = document.querySelector('#personelTableBody input[placeholder="Personel Adı"]').value;
        var ikametEnlem = parseFloat(document.querySelector('#personelTableBody input[placeholder="İkamet Enlem"]').value);
        var ikametBoylam = parseFloat(document.querySelector('#personelTableBody input[placeholder="İkamet Boylam"]').value);
        var calismaEnlem = parseFloat(document.querySelector('#personelTableBody input[placeholder="Çalışma Enlem"]').value);
        var calismaBoylam = parseFloat(document.querySelector('#personelTableBody input[placeholder="Çalışma Boylam"]').value);

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
    }
}

function satirSil(button) {
    var row = button.parentNode.parentNode;
    // Harita üzerindeki pinleri ve çizgiyi sil
    if (row.pins) {
        row.pins.forEach(pin => map.removeLayer(pin));
    }
    if (row.polyline) {
        map.removeLayer(row.polyline);
    }
    row.parentNode.removeChild(row);
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

function excelCiktisiAl() {
    // Örnek veri
    var data = [
        { Isim: 'Örnek Personel', Mesafe: '10 km' }
    ];

    var worksheet = XLSX.utils.json_to_sheet(data);
    var workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Personel Listesi");

    // Excel dosyasını indir
    XLSX.writeFile(workbook, "personel_listesi.xlsx");
}
