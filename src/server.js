const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 TaskFlow API Sunucusu Başarıyla Başlatıldı!`);
  console.log(`📡 Port: http://localhost:${PORT}`);
  console.log(`📋 Dokümantasyon & Durum: http://localhost:${PORT}/`);
  console.log(`✅ Görevler (Tasks): http://localhost:${PORT}/api/tasks`);
  console.log(`📊 Raporlar (Reports): http://localhost:${PORT}/api/reports/summary`);
  console.log(`=======================================================`);
});
