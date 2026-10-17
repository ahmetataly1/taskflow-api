/**
 * Otomatik Test Koşucusu (Test Runner)
 * Bu script, TaskFlow REST API'sinin tüm zorunlu CRUD ve ileri seviye endpoint'lerini otomatik olarak test eder.
 */

const http = require('http');
const app = require('./src/app');

const PORT = 3099; // Test portu
let server;

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    };

    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', err => reject(err));
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  server = app.listen(PORT);
  console.log(`\n🧪 TaskFlow API Otomatik Testleri Başlatılıyor (Port ${PORT})...\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [BAŞARILI] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [BAŞARISIZ] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Kök Bilgi Kontrolü
    const rootRes = await request('GET', '/');
    assert(rootRes.status === 200 && rootRes.data.project === 'TaskFlow API', 'GET / - API Durum ve Bilgi Testi');

    // 2. Tüm Görevleri Listeleme (Aşama 03)
    const listRes = await request('GET', '/api/tasks');
    assert(listRes.status === 200 && Array.isArray(listRes.data.data), 'GET /api/tasks - Görev Listeleme');

    // 3. Validation Testi: Eksik veri ile görev ekleme (İsteğe Bağlı 02)
    const invalidCreate = await request('POST', '/api/tasks', { title: 'ab' });
    assert(
      invalidCreate.status === 400 && invalidCreate.data.errors && invalidCreate.data.errors.length > 0,
      'POST /api/tasks (Geçersiz Veri) - Validation Middleware 400 Bad Request Kontrolü'
    );

    // 4. Yeni Görev Ekleme (Aşama 03)
    const newPayload = {
      title: 'Kapsamlı Birim Testleri',
      description: 'API rotalarının uçtan uca testlerinin yapılması ve doğrulanması',
      priority: 'high',
      assignee: 'musa'
    };
    const createRes = await request('POST', '/api/tasks', newPayload);
    assert(
      createRes.status === 201 && createRes.data.data && createRes.data.data.title === newPayload.title,
      'POST /api/tasks - Yeni Görev Ekleme (201 Created)'
    );
    const createdId = createRes.data.data.id;

    // 5. Görev Detayı (Aşama 03)
    const detailRes = await request('GET', `/api/tasks/${createdId}`);
    assert(detailRes.status === 200 && detailRes.data.data.id === createdId, `GET /api/tasks/:id - Görev Detayı (${createdId})`);

    // 6. Görev Güncelleme (Aşama 03)
    const updateRes = await request('PUT', `/api/tasks/${createdId}`, {
      status: 'completed',
      priority: 'low'
    });
    assert(
      updateRes.status === 200 && updateRes.data.data.status === 'completed' && updateRes.data.data.priority === 'low',
      'PUT /api/tasks/:id - Görev Güncelleme'
    );

    // 7. Filtreleme: Duruma Göre (İsteğe Bağlı 01)
    const filterStatusRes = await request('GET', '/api/tasks?status=completed');
    const allCompleted = filterStatusRes.data.data.every(t => t.status === 'completed');
    assert(filterStatusRes.status === 200 && allCompleted, 'GET /tasks?status=completed - Duruma Göre Filtreleme');

    // 8. Filtreleme: Önceliğe Göre (İsteğe Bağlı 01)
    const filterPriorityRes = await request('GET', '/api/tasks?priority=high');
    const allHigh = filterPriorityRes.data.data.every(t => t.priority === 'high');
    assert(filterPriorityRes.status === 200 && allHigh, 'GET /tasks?priority=high - Önceliğe Göre Filtreleme');

    // 9. Görev Arama (İsteğe Bağlı 01)
    const searchRes = await request('GET', '/api/tasks/search?keyword=backend');
    assert(searchRes.status === 200 && searchRes.data.count >= 1, "GET /tasks/search?keyword=backend - Arama Fonksiyonu");

    // 10. Kullanıcı Bazlı Listeleme (İsteğe Bağlı 01)
    const userRes = await request('GET', '/api/tasks/assignee/musa');
    const allMusa = userRes.data.data.every(t => t.assignee === 'musa');
    assert(userRes.status === 200 && allMusa, 'GET /tasks/assignee/musa - Kullanıcı Bazlı Listeleme');

    // 11. Sayfalama ve Sıralama (İsteğe Bağlı 01)
    const pageRes = await request('GET', '/api/tasks?page=1&limit=2&sort=createdAt');
    assert(
      pageRes.status === 200 && pageRes.data.pagination && pageRes.data.pagination.limit === 2,
      'GET /tasks?page=1&limit=2 - Sayfalama ve Sıralama'
    );

    // 12. Raporlama: Tamamlanan Görevler (İsteğe Bağlı 03)
    const repComp = await request('GET', '/api/reports/completed');
    assert(repComp.status === 200 && typeof repComp.data.totalCompleted === 'number', 'GET /reports/completed - Tamamlanan Raporu');

    // 13. Raporlama: Bekleyen Görevler (İsteğe Bağlı 03)
    const repPend = await request('GET', '/api/reports/pending');
    assert(repPend.status === 200 && typeof repPend.data.totalPending === 'number', 'GET /reports/pending - Bekleyen Raporu');

    // 14. Raporlama: Sistem Özeti (İsteğe Bağlı 03)
    const repSummary = await request('GET', '/api/reports/summary');
    assert(
      repSummary.status === 200 && repSummary.data.overview && repSummary.data.priorityBreakdown,
      'GET /reports/summary - Genel Sistem Özeti ve İstatistikleri'
    );

    // 15. Görev Silme (Aşama 03)
    const deleteRes = await request('DELETE', `/api/tasks/${createdId}`);
    assert(deleteRes.status === 200 && deleteRes.data.success === true, `DELETE /api/tasks/:id - Görev Silme`);

    // 16. Silinen Görevin Bulunamaması (404)
    const notFoundCheck = await request('GET', `/api/tasks/${createdId}`);
    assert(notFoundCheck.status === 404, 'Silinen Göreve Ulaşım (404 Not Found Doğrulaması)');

  } catch (err) {
    console.error('Test sırasında beklenmedik hata:', err);
    failed++;
  } finally {
    server.close();
    console.log(`\n========================================`);
    console.log(`🏁 Test Sonuçları: ${passed} Başarılı, ${failed} Hatalı`);
    console.log(`========================================\n`);
  }
}

runTests();
