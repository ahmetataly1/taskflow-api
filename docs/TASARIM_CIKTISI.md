# TASKFLOW — Sistem ve API Tasarım Çıktısı (Aşama 01)

Bu doküman, Node.js Backend Eğitimi Bitirme Projesi (TASKFLOW) kapsamındaki **İhtiyaç Analizi ve Sistem Tasarımı (Aşama 01)** çıktısıdır.

---

## 1. Proje Tanıtım Dokümanı ve Sistem Senaryosu
* **Proje Adı:** TASKFLOW — Görev ve Proje Yönetim Sistemi API
* **Geliştirme Ortamı:** Node.js, Express.js (REST API mimarisi)
* **Kullanım Senaryosu:** Bir yazılım şirketinde ekip içi görev dağılımı, görevlerin çalışanlara atanması, öncelik ve durum takibi ile genel istatistiksel raporlama süreçlerinin merkezi bir backend üzerinden yürütülmesini sağlar.

---

## 2. API Mimarisi ve Klasör Yapısı (Architecture Design)
Sistem, sorumlulukların ayrılığı prensibine (MVC / Layered Architecture) uygun olarak tasarlanmıştır:

```text
taskflow-api/
├── data/
│   └── tasks.json              # Dosya tabanlı JSON veri deposu
├── docs/                       # Dokümantasyon ve tasarım çıktıları
├── logs/
│   └── access.log              # Logger Middleware kayıtları
├── src/
│   ├── controllers/            # İstek karşılama ve yanıt üretme katmanı
│   │   ├── taskController.js
│   │   └── reportController.js
│   ├── middlewares/            # Ara katman yazılımları
│   │   ├── loggerMiddleware.js # HTTP istek loglayıcı
│   │   ├── validationMiddleware.js # Veri doğrulama kontrolcüsü
│   │   └── errorMiddleware.js  # Hata yönetimi
│   ├── models/                 # Veri işleme, filtreleme ve raporlama modeli
│   │   └── taskModel.js
│   ├── routes/                 # URL yönlendirme katmanı
│   │   ├── taskRoutes.js
│   │   └── reportRoutes.js
│   ├── utils/                  # Yardımcı modüller (Dosya okuma/yazma)
│   ├── app.js                  # Express konfigürasyonu
│   └── server.js               # Sunucu dinleme noktası (Port 3000)
├── README.md                   # Kurulum kılavuzu
└── test-runner.js              # Otomatik test scripti
```

---

## 3. Veri Modeli Tasarımı (Data Model & Schema)

Görev varlığı (`Task Entity`) aşağıdaki alan ve tiplerden oluşmaktadır:

| Alan Adı (Field) | Veri Tipi | Zorunluluk | Varsayılan | Açıklama ve Kurallar |
| :--- | :--- | :---: | :---: | :--- |
| `id` | String | Sistem | Otomatik | Benzersiz görev kimliği (örn: `task-1792273746073-905`) |
| `title` | String | Zorunlu | - | Görev başlığı (En az 3 karakter) |
| `description` | String | Zorunlu | - | Görev açıklaması (En az 5 karakter) |
| `priority` | String | Zorunlu | - | Öncelik seviyesi: `low`, `medium`, `high` |
| `assignee` | String | Zorunlu | - | Görevin atandığı personel kullanıcı adı (örn: `ahmet`, `musa`) |
| `status` | String | İsteğe Bağlı | `pending` | Görevin durumu: `pending`, `in-progress`, `completed` |
| `createdAt` | String (ISO) | Sistem | Now() | Oluşturulma tarihi (ISO 8601) |
| `updatedAt` | String (ISO) | Sistem | Now() | Son güncellenme tarihi (ISO 8601) |

---

## 4. API Tasarım Dokümanı ve Endpoint Listesi (Endpoints Design)

### A. Temel CRUD Endpointleri (Zorunlu Aşama 03)
1. **Görev Ekleme:** `POST /api/tasks`  
   * Body: `{ title, description, priority, assignee }`  
   * Yanıt: `201 Created`
2. **Görev Listeleme:** `GET /api/tasks`  
   * Yanıt: `200 OK` (Tüm görevler listesi)
3. **Görev Detayı:** `GET /api/tasks/:id`  
   * Yanıt: `200 OK` veya `404 Not Found`
4. **Görev Güncelleme:** `PUT /api/tasks/:id` veya `PATCH /api/tasks/:id`  
   * Body: Güncellenecek alanlar  
   * Yanıt: `200 OK`
5. **Görev Silme:** `DELETE /api/tasks/:id`  
   * Yanıt: `200 OK` (Silinen kayıt bilgisi)

### B. Gelişmiş API ve Filtreleme Endpointleri (İsteğe Bağlı 01)
* **Duruma Göre Filtreleme:** `GET /api/tasks?status=completed`
* **Önceliğe Göre Filtreleme:** `GET /api/tasks?priority=high`
* **Metin Araması:** `GET /api/tasks/search?keyword=backend`
* **Çalışan Bazlı Filtreleme:** `GET /api/tasks/assignee/musa`
* **Sayfalama (Pagination):** `GET /api/tasks?page=1&limit=10`
* **Sıralama (Sorting):** `GET /api/tasks?sort=createdAt&order=desc`

### C. Raporlama Servisleri Tasarımı (İsteğe Bağlı 03)
* **Tamamlanan Görev Sayısı & Listesi:** `GET /api/reports/completed`
* **Bekleyen Görev Sayısı & Listesi:** `GET /api/reports/pending`
* **Genel Sistem İstatistik Özeti:** `GET /api/reports/summary`
