var map = L.map("map").setView([41.015137, 28.97953], 10); // İstanbul

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
}).addTo(map);

var personelKoordinatlari = [];

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
    document.getElementById("personelListesi").innerHTML += `<div class="personelItem">${isim} <button onclick="sil('${isim}')">Sil</button></div>`;

    // Formu temizle
    document.getElementById("personelIsim").value = '';
    document.getElementById("ikametEnlem").value = '';
    document.getElementById("ikametBoylam").value = '';
    document.getElementById("calismaEnlem").value = '';
    document.getElementById("calismaBoylam").value = '';
}

function goster() {
    // Haritayı temizle
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });

    // Mesafe listesini temizle
    document.getElementById("mesafeUl").innerHTML = '';

    personelKoordinatlari.forEach(function (personel, index) {
        // Renkler için bir dizi oluştur
        var renkler = ['red', 'blue', 'green', 'purple', 'orange', 'brown', 'pink', 'gray', 'cyan', 'magenta'];
        var renk = renkler[index % renkler.length]; // Her bir personel için farklı renk

        // Çizgiyi ekle
        var polyline = L.polyline([personel.ikamet, personel.calisma], {
            color: renk,
            weight: 3,
            opacity: 0.7,
        }).addTo(map);

        // Mesafeyi hesapla
        var mesafe = map.distance(L.latLng(personel.ikamet), L.latLng(personel.calisma)) / 1000; // km cinsinden

        // İkametgah adresinin üstünde personel ismini göster
        var ikametIcon = L.divIcon({
            html: `<div style="font-size: 14px; color: ${renk}; font-weight: bold;">${personel.isim}</div>`,
            className: 'isim-label',
            iconAnchor: [0, 0], // Konum üzerinde hizalama
        });
        L.marker(personel.ikamet, { icon: ikametIcon }).addTo(map);

        // Mesafeyi çizginin biraz üstünde göstermek için orta nokta biraz yukarı kaydırıldı
        var ortaNokta = [
            (personel.ikamet[0] + personel.calisma[0]) / 2 + 0.002, // 0.002 enlem değeri ile hafif yukarı kaydırılır
            (personel.ikamet[1] + personel.calisma[1]) / 2,
        ];

        // Mesafe bilgisini sabit siyah renkli olarak göster
        var mesafeIcon = L.divIcon({
            html: `<div style="font-size: 14px; color: black;">${mesafe.toFixed(2)} km</div>`,
            className: 'mesafe-label',
            iconAnchor: [0, 0], // Konum üzerinde hizalama
        });
        L.marker(ortaNokta, { icon: mesafeIcon }).addTo(map);

        // Mesafeyi listeye ekle
        var mesafeItem = document.createElement('li');
        mesafeItem.textContent = `${personel.isim}: ${mesafe.toFixed(2)} km`;
        document.getElementById("mesafeUl").appendChild(mesafeItem);
    });
}

function sil(isim) {
    personelKoordinatlari = personelKoordinatlari.filter(function(personel) {
        return personel.isim !== isim;
    });
    document.getElementById("personelListesi").innerHTML = '';
    personelKoordinatlari.forEach(function(personel) {
        document.getElementById("personelListesi").innerHTML += `<div class="personelItem">${personel.isim} <button onclick="sil('${personel.isim}')">Sil</button></div>`;
    });
}
