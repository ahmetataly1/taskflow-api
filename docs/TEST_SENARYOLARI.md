# TASKFLOW — Test Senaryoları ve Postman Test Kılavuzu

Bu doküman, TaskFlow REST API'sinin tüm uç noktalarının (CRUD, Validation, Filtreleme, Sıralama, Arama ve Raporlama) test edilmesine yönelik adım adım yazılı senaryoları içerir.

---

## 1. Test Ortamının Hazırlanması
1. Terminalde proje klasörüne gidin:
   ```bash
   cd taskflow-api
   ```
2. Bağımlılıkları kurun:
   ```bash
   npm install
   ```
3. Sunucuyu başlatın:
   ```bash
   npm start
   ```
   (Sunucu `http://localhost:3000` adresinde dinlemeye başlar).

---

## 2. Otomatik Testlerin Koşulması
Projede yer alan entegre test paketi sayesinde tek komutla tüm senaryoları doğrulayabilirsiniz:
```bash
npm test
```
*Bu komut 16 farklı senaryoyu (CRUD, HTTP status kodları, veri bütünlüğü, hata yönetimi) test eder ve sonuçları konsola yazdırır.*

---

## 3. Postman ile Test ve Ekran Görüntüsü Alma Rehberi
Teslim formunda istenen **Postman Test Ekran Görüntüleri** için:
1. Postman uygulamasını açın.
2. **Import** butonuna tıklayın.
3. `docs/postman_collection.json` dosyasını seçerek koleksiyonu içeri aktarın.
4. Aşağıdaki adımları sırayla çalıştırıp ekran görüntüsü (screenshot) alın:

### Senaryo 1: Görev Ekleme (POST /api/tasks)
* **Amaç:** Yeni bir görev oluşturulduğunu ve `201 Created` döndüğünü doğrulamak.
* **Girdi:**
  ```json
  {
    "title": "Postman Test Senaryoları",
    "description": "API uç noktalarının uçtan uca testlerinin tamamlanması",
    "priority": "high",
    "assignee": "musa"
  }
  ```
* **Beklenen Sonuç:** HTTP 201 Created, `success: true` ve oluşturulan nesnenin `id` değeri.

### Senaryo 2: Görev Listeleme (GET /api/tasks)
* **Amaç:** Tüm görevlerin dizi olarak listelendiğini ve `200 OK` döndüğünü doğrulamak.
* **Beklenen Sonuç:** HTTP 200 OK, `count` değeri ve `data` dizisi.

### Senaryo 3: Tekil Görev Detayı (GET /api/tasks/:id)
* **Amaç:** Belirli bir ID'ye sahip görevin başarıyla getirildiğini doğrulamak.
* **Beklenen Sonuç:** HTTP 200 OK ve ilgili nesne.

### Senaryo 4: Görev Güncelleme (PUT /api/tasks/:id)
* **Amaç:** Var olan görevin bilgilerinin güncellendiğini doğrulamak.
* **Girdi:**
  ```json
  {
    "status": "completed",
    "priority": "low"
  }
  ```
* **Beklenen Sonuç:** HTTP 200 OK, güncellenmiş değerler ve güncel `updatedAt` tarihi.

### Senaryo 5: Görev Silme (DELETE /api/tasks/:id)
* **Amaç:** Görevin sistemden silindiğini ve silinen kayda tekrar erişildiğinde `404 Not Found` döndüğünü doğrulamak.
* **Beklenen Sonuç:** HTTP 200 OK, `success: true`.

### Senaryo 6: Validation Middleware Testi (POST /api/tasks)
* **Amaç:** Eksik/hatalı girdilerde `400 Bad Request` ve açıklayıcı hata dizisi dönüldüğünü doğrulamak.
* **Girdi:**
  ```json
  {
    "title": "A"
  }
  ```
* **Beklenen Sonuç:** HTTP 400 Bad Request, `errors` dizisinde en az 4 doğrulama hatası mesajı.

### Senaryo 7: Filtreleme ve Arama Testleri
* `GET /api/tasks?status=completed` -> Yalnızca tamamlanan görevler.
* `GET /api/tasks/search?keyword=backend` -> Başlık ve açıklamasında 'backend' geçenler.
* `GET /api/tasks/assignee/musa` -> Musa'ya atanmış görevler.

### Senaryo 8: Raporlama Servisleri
* `GET /api/reports/summary` -> Toplam görev, bekleyen/tamamlanan dağılımı ve istatistikler.
