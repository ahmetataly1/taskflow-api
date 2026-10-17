# 🚀 TASKFLOW — Görev ve Proje Yönetim Sistemi API

**Node.js ile Backend Programlama — Bitirme Projesi**

TaskFlow, modern bir yazılım ekibinin projelerini, görev dağılımlarını, önceliklerini ve çalışan sorumluluklarını takip etmek üzere **Node.js** ve **Express.js** ile geliştirilmiş kurumsal standartlarda bir **RESTful API** sistemidir.

Bu proje; 5 günlük eğitimin tüm zorunlu isterlerini (**100/100 Puan**) ve sunumda belirtilen **4 İleri Seviye Pratik İsterin tamamını** eksiksiz olarak içermektedir.

---

## 📌 Özellikler

### Zorunlu Kapsam (100 Puan)
- ✅ **REST API Tasarımı**: Standart HTTP metodları (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) ve durum kodları (`200`, `201`, `400`, `404`, `500`).
- ✅ **Tam CRUD Yönetimi**: Görev ekleme, listeleme, detay görüntüleme, güncelleme ve silme.
- ✅ **Temel Middleware (Logger)**: Gelen her isteğin metodunu, URL adresini, HTTP durumunu ve milisaniye cinsinden süresini hem konsola hem de `logs/access.log` dosyasına kaydeder.
- ✅ **Modüler Mimari**: `controllers`, `models`, `routes`, `middlewares`, `utils` katmanlarına ayrılmış temiz kod mimarisi.

### İsteğe Bağlı İleri Seviye Özellikler
- 🌟 **İsteğe Bağlı 01 - Gelişmiş API Özellikleri**:
  - Duruma göre filtreleme (`GET /api/tasks?status=completed`)
  - Önceliğe göre filtreleme (`GET /api/tasks?priority=high`)
  - Anahtar kelime ile arama (`GET /api/tasks/search?keyword=backend`)
  - Kullanıcı bazlı listeleme (`GET /api/tasks/assignee/musa`)
  - Sayfalama (`GET /api/tasks?page=1&limit=10`)
  - Sıralama (`GET /api/tasks?sort=createdAt&order=desc`)
- 🌟 **İsteğe Bağlı 02 - Validation Middleware**:
  - `title`, `description`, `priority` ve `assignee` alanlarının sıkı tip ve uzunluk doğrulaması. Eksik ya da hatalı parametrelerde açıklayıcı `400 Bad Request` yanıtı.
- 🌟 **İsteğe Bağlı 03 - Raporlama Servisleri**:
  - Tamamlanan görev sayısı ve listesi (`GET /api/reports/completed`)
  - Bekleyen görev sayısı ve listesi (`GET /api/reports/pending`)
  - İstatistiksel genel sistem özeti (`GET /api/reports/summary`)
- 🌟 **İsteğe Bağlı 04 - Kapsamlı Dokümantasyon Seti**:
  - Postman import dosyası (`docs/postman_collection.json`)
  - Sistem Tasarım Dokümanı (`docs/PROJE_TANIMI.md`)
  - Endpoint Dokümantasyonu (`docs/API_DOKUMANTASYONU.md`)
  - Yazılı Test Senaryoları (`docs/TEST_SENARYOLARI.md`)

---

## 🛠️ Kurulum ve Çalıştırma

### 1. Gereksinimler
- **Node.js** (v18 veya üzeri önerilir)
- **npm** (Node Package Manager)

### 2. Bağımlılıkların Kurulması
Proje dizininde aşağıdaki komutu çalıştırarak gerekli paketleri yükleyin:

```bash
npm install
```

### 3. Sunucuyu Başlatma
Sunucuyu prodüksiyon modunda başlatmak için:

```bash
npm start
```

Geliştirme modunda (kod değişikliklerini otomatik izleyerek) başlatmak için:

```bash
npm run dev
```

Sunucu başarıyla başlatıldığında konsolda aşağıdaki mesajı göreceksiniz:
```text
🚀 TaskFlow API Sunucusu Başarıyla Başlatıldı!
📡 Port: http://localhost:3000
📋 Dokümantasyon & Durum: http://localhost:3000/
✅ Görevler (Tasks): http://localhost:3000/api/tasks
📊 Raporlar (Reports): http://localhost:3000/api/reports/summary
```

---

## 🧪 Otomatik Testlerin Çalıştırılması

Projede 16 farklı iş kuralını ve rotayı uçtan uca test eden entegre bir test çalıştırıcı bulunmaktadır:

```bash
npm test
```

Tüm testler başarıyla tamamlandığında şu çıktıyı verir:
```text
🏁 Test Sonuçları: 16 Başarılı, 0 Hatalı
```

---

## 📮 Postman ile Test Etme

1. Postman uygulamasını açın.
2. Sol üstteki **Import** butonuna tıklayın.
3. Proje içerisindeki `docs/postman_collection.json` dosyasını seçin.
4. Koleksiyondaki hazır istekleri tıklayarak doğrudan test edebilir ve teslimat için ekran görüntüleri alabilirsiniz.

---

## 📂 Proje Dizin Yapısı

```text
taskflow-api/
├── data/
│   └── tasks.json              # Görev kayıtlarının tutulduğu JSON veritabanı
├── docs/
│   ├── PROJE_TANIMI.md         # Amaç, senaryo ve sistem tasarımı (Aşama 01)
│   ├── API_DOKUMANTASYONU.md   # Endpoint detayları ve örnek JSON'lar
│   ├── TEST_SENARYOLARI.md     # Postman test senaryoları rehberi
│   └── postman_collection.json # Hazır Postman koleksiyonu
├── logs/
│   └── access.log              # İstek logları (Logger Middleware)
├── src/
│   ├── controllers/            # İstekleri karşılayan controller sınıfları
│   ├── middlewares/            # Logger, Validation, Hata yakalama
│   ├── models/                 # Veri işleme, filtreleme ve raporlama mantığı
│   ├── routes/                 # Express Router tanımları
│   ├── utils/                  # Yardımcı dosya yönetim modülleri
│   ├── app.js                  # Express konfigürasyonu
│   └── server.js               # Sunucu dinleme dosyası
├── test-runner.js              # Otomatik test scripti
├── package.json
└── README.md                   # Kurulum notu
```

---

## 📄 Lisans
Bu proje eğitim ve bitirme projesi amacıyla MIT lisansı altında hazırlanmıştır.
