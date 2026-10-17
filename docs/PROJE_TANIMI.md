# TASKFLOW — Proje Tanıtım ve Sistem Tasarım Dokümanı

## 1. Projenin Amacı ve Kapsamı
**TaskFlow**, modern yazılım ekiplerinin proje süreçlerini, görev dağılımlarını, öncelik sıralamalarını ve personel iş yüklerini merkezi bir mimaride yönetebilmeleri amacıyla geliştirilmiş **Node.js & Express.js tabanlı bir RESTful API** sistemidir.

Proje, 5 günlük Node.js backend eğitimi ve bitirme projesi standartlarına tam uyumlu olarak;
* Modüler mimari (MVC/Layered Pattern),
* Standart HTTP durum kodları ve metodları,
* Özel ara yazılımlar (Custom Logger & Validation Middleware),
* Gelişmiş veri filtreleme, arama, sayfalama ve raporlama yetenekleri
esas alınarak tasarlanmıştır.

---

## 2. Senaryo ve Problem Tanımı
Bir yazılım şirketinde;
* Görevlerin kim tarafından yürütüldüğü,
* Hangi görevlerin aciliyet taşıdığı (`high`, `medium`, `low`),
* Görevin mevcut aşaması (`pending`, `in-progress`, `completed`),
* Ekip üyelerinin üzerindeki iş yükünün istatistiksel raporları
gibi ihtiyaçların tek bir REST API üzerinden yönetilmesi hedeflenmektedir.

---

## 3. Sistem Mimarisi ve Klasör Yapısı
Proje, sorumlulukların ayrılığı (Separation of Concerns) prensibine göre katmanlı mimaride kurgulanmıştır:

```text
taskflow-api/
├── data/
│   └── tasks.json              # Dosya tabanlı JSON veri deposu
├── docs/
│   ├── PROJE_TANIMI.md         # Proje ve sistem tasarım dokümanı
│   ├── API_DOKUMANTASYONU.md   # Endpoint detayları ve örnek istek/yanıtlar
│   ├── TEST_SENARYOLARI.md     # Yazılı test senaryoları
│   └── postman_collection.json # Postman import koleksiyonu
├── logs/
│   └── access.log              # Logger middleware tarafından tutulan erişim kayıtları
├── src/
│   ├── controllers/
│   │   ├── reportController.js # İstatistik ve raporlama uç noktaları kontrolcüsü
│   │   └── taskController.js   # Görev CRUD ve filtreleme kontrolcüsü
│   ├── middlewares/
│   │   ├── errorMiddleware.js  # 404 ve global hata yakalayıcı
│   │   ├── loggerMiddleware.js # Temel Logger (Aşama 03)
│   │   └── validationMiddleware.js # Girdi doğrulama middleware (İsteğe Bağlı 02)
│   ├── models/
│   │   └── taskModel.js        # Veri erişim, filtreleme ve hesaplama modeli
│   ├── routes/
│   │   ├── reportRoutes.js     # /reports rotaları
│   │   └── taskRoutes.js       # /tasks rotaları
│   ├── utils/
│   │   └── fileHandler.js      # Güvenli asenkron JSON dosya okuma/yazma modülü
│   ├── app.js                  # Express uygulaması yapılandırması
│   └── server.js               # Sunucu başlangıç noktası (Entrypoint)
├── test-runner.js              # Entegre otomatik test scripti
├── package.json
└── README.md                   # Kurulum ve çalıştırma kılavuzu
```

---

## 4. Veri Modeli Tasarımı (Task Entity)

| Alan | Tip | Zorunlu mu? | Açıklama / Kısıtlar |
| :--- | :--- | :---: | :--- |
| `id` | `String` | Otomatik | Benzersiz kimlik (örn: `task-1791894236213-217`) |
| `title` | `String` | Evet | Görev başlığı (En az 3 karakter) |
| `description` | `String` | Evet | Görev detaylı açıklaması (En az 5 karakter) |
| `priority` | `String` | Evet | Öncelik derecesi: `low`, `medium`, `high` |
| `assignee` | `String` | Evet | Görevin atandığı personel kullanıcı adı (örn: `musa`) |
| `status` | `String` | Hayır (Varsayılan: `pending`) | Durum: `pending`, `in-progress`, `completed` |
| `createdAt` | `String (ISO 8601)` | Otomatik | Oluşturulma zaman damgası |
| `updatedAt` | `String (ISO 8601)` | Otomatik | Son güncellenme zaman damgası |

---

## 5. API Uç Noktaları (Endpoint Listesi)

### Temel CRUD (Zorunlu)
* `GET /api/tasks` — Tüm görevleri listeleme
* `GET /api/tasks/:id` — Tekil görev detayını getirme
* `POST /api/tasks` — Yeni görev oluşturma
* `PUT /api/tasks/:id` veya `PATCH /api/tasks/:id` — Görev güncelleme
* `DELETE /api/tasks/:id` — Görev silme

### İleri Seviye Filtreleme ve Arama (İsteğe Bağlı 01)
* `GET /api/tasks?status=completed` — Duruma göre filtreleme
* `GET /api/tasks?priority=high` — Önceliğe göre filtreleme
* `GET /api/tasks/search?keyword=backend` — Başlık ve açıklamada arama
* `GET /api/tasks/assignee/musa` — Kullanıcı bazlı görev listesi
* `GET /api/tasks?page=1&limit=10` — Sayfalama (Pagination)
* `GET /api/tasks?sort=createdAt&order=desc` — Alan ve yöne göre sıralama

### Raporlama Servisleri (İsteğe Bağlı 03)
* `GET /api/reports/completed` — Tamamlanan görev sayısı ve listesi
* `GET /api/reports/pending` — Bekleyen görev sayısı ve listesi
* `GET /api/reports/summary` — Genel sistem özeti, tamamlama yüzdesi, öncelik ve çalışan dağılımı
