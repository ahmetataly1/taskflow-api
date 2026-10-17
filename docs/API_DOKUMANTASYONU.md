# TASKFLOW — API Dokümantasyonu (Request & Response Rehberi)

Tüm istekler `http://localhost:3000` temel adresi üzerinden gerçekleştirilir. API yanıtları standart JSON formatında döner.

---

## 1. Görevleri Listeleme (Filtreleme & Sayfalama Destekli)
* **Method:** `GET`
* **URL:** `/api/tasks`
* **Query Parametreleri:**
  * `status`: `pending` | `in-progress` | `completed`
  * `priority`: `low` | `medium` | `high`
  * `assignee`: Personel adı (örn: `musa`)
  * `sort`: Sıralanacak alan (örn: `createdAt`, `title`)
  * `order`: `asc` | `desc` (varsayılan: `desc`)
  * `page`: Sayfa no (örn: `1`)
  * `limit`: Sayfa başı eleman sayısı (örn: `5`)

### Örnek İstek:
```http
GET /api/tasks?status=completed&sort=createdAt HTTP/1.1
Host: localhost:3000
```

### Örnek Yanıt (200 OK):
```json
{
  "success": true,
  "count": 2,
  "pagination": null,
  "data": [
    {
      "id": "task-102",
      "title": "CRUD Endpointlerinin Geliştirilmesi",
      "description": "Görev oluşturma, okuma, güncelleme ve silme API rotalarının yazılması",
      "status": "completed",
      "priority": "high",
      "assignee": "musa",
      "createdAt": "2026-10-11T10:30:00.000Z",
      "updatedAt": "2026-10-11T16:00:00.000Z"
    }
  ]
}
```

---

## 2. Tekil Görev Detayı
* **Method:** `GET`
* **URL:** `/api/tasks/:id`

### Örnek Yanıt (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "task-101",
    "title": "Backend Mimarisi Kurulumu",
    "description": "Express.js ile modüler backend mimarisinin ve klasör yapısının oluşturulması",
    "status": "completed",
    "priority": "high",
    "assignee": "musa",
    "createdAt": "2026-10-10T09:00:00.000Z",
    "updatedAt": "2026-10-10T12:00:00.000Z"
  }
}
```

### Hatalı Yanıt (404 Not Found):
```json
{
  "success": false,
  "message": "'task-999' kimlikli görev bulunamadı."
}
```

---

## 3. Yeni Görev Ekleme
* **Method:** `POST`
* **URL:** `/api/tasks`
* **Headers:** `Content-Type: application/json`

### Örnek Request Body:
```json
{
  "title": "Dokümantasyon Hazırlığı",
  "description": "API kullanım kılavuzu ve Postman test dökümanlarının hazırlanması",
  "priority": "high",
  "assignee": "musa",
  "status": "pending"
}
```

### Başarılı Yanıt (201 Created):
```json
{
  "success": true,
  "message": "Görev başarıyla oluşturuldu.",
  "data": {
    "id": "task-1791894236213-217",
    "title": "Dokümantasyon Hazırlığı",
    "description": "API kullanım kılavuzu ve Postman test dökümanlarının hazırlanması",
    "status": "pending",
    "priority": "high",
    "assignee": "musa",
    "createdAt": "2026-10-13T12:23:56.213Z",
    "updatedAt": "2026-10-13T12:23:56.213Z"
  }
}
```

### Doğrulama Hatası (400 Bad Request):
```json
{
  "success": false,
  "message": "Doğrulama hatası: Gönderilen veriler geçersiz veya eksik.",
  "errors": [
    "title alanı zorunludur ve boş bırakılamaz.",
    "priority yalnızca 'low', 'medium' veya 'high' olabilir. Gönderilen: 'critical'"
  ]
}
```

---

## 4. Görev Güncelleme
* **Method:** `PUT` veya `PATCH`
* **URL:** `/api/tasks/:id`
* **Headers:** `Content-Type: application/json`

### Örnek Request Body:
```json
{
  "status": "completed",
  "priority": "medium"
}
```

### Başarılı Yanıt (200 OK):
```json
{
  "success": true,
  "message": "Görev başarıyla güncellendi.",
  "data": {
    "id": "task-103",
    "title": "Validation Middleware Entegrasyonu",
    "description": "Gelen JSON verisinin title, description, priority ve assignee alanlarının doğrulanması",
    "status": "completed",
    "priority": "medium",
    "assignee": "ayse",
    "createdAt": "2026-10-12T08:15:00.000Z",
    "updatedAt": "2026-10-13T12:25:00.000Z"
  }
}
```

---

## 5. Görev Silme
* **Method:** `DELETE`
* **URL:** `/api/tasks/:id`

### Başarılı Yanıt (200 OK):
```json
{
  "success": true,
  "message": "Görev sistemden başarıyla silindi.",
  "data": {
    "id": "task-105",
    "title": "Postman Test Koleksiyonunun Hazırlanması"
  }
}
```

---

## 6. Görev Arama
* **Method:** `GET`
* **URL:** `/api/tasks/search?keyword=backend`

### Başarılı Yanıt (200 OK):
```json
{
  "success": true,
  "keyword": "backend",
  "count": 1,
  "data": [
    {
      "id": "task-101",
      "title": "Backend Mimarisi Kurulumu",
      "description": "Express.js ile modüler backend mimarisinin ve klasör yapısının oluşturulması",
      "status": "completed",
      "priority": "high",
      "assignee": "musa"
    }
  ]
}
```

---

## 7. Kullanıcı Bazlı Görev Listeleme
* **Method:** `GET`
* **URL:** `/api/tasks/assignee/:name` (Örn: `/api/tasks/assignee/musa`)

### Başarılı Yanıt (200 OK):
```json
{
  "success": true,
  "assignee": "musa",
  "count": 2,
  "data": [
    {
      "id": "task-101",
      "title": "Backend Mimarisi Kurulumu",
      "assignee": "musa"
    }
  ]
}
```

---

## 8. Raporlama Servisleri

### 8.1. Tamamlanan Görevler Raporu
* **Method:** `GET`
* **URL:** `/api/reports/completed`

### 8.2. Bekleyen Görevler Raporu
* **Method:** `GET`
* **URL:** `/api/reports/pending`

### 8.3. Genel Sistem Özeti (Summary)
* **Method:** `GET`
* **URL:** `/api/reports/summary`

#### Örnek Yanıt (200 OK):
```json
{
  "success": true,
  "reportType": "system_summary",
  "generatedAt": "2026-10-13T12:26:00.000Z",
  "overview": {
    "totalTasks": 5,
    "completedCount": 2,
    "pendingCount": 2,
    "inProgressCount": 1,
    "completionRatePercentage": 40.0
  },
  "priorityBreakdown": {
    "high": 2,
    "medium": 2,
    "low": 1
  },
  "assigneeBreakdown": {
    "musa": { "total": 2, "completed": 2, "pending": 0, "inProgress": 0 },
    "ayse": { "total": 1, "completed": 0, "pending": 0, "inProgress": 1 },
    "ali": { "total": 1, "completed": 0, "pending": 1, "inProgress": 0 }
  }
}
```
