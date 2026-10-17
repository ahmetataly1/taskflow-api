const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');

/**
 * ----------------------------------------------------
 * Raporlama Servisleri Rotaları (İsteğe Bağlı 03)
 * ----------------------------------------------------
 */

// Tamamlanan Görev Sayısı & Listesi: GET /api/reports/completed
router.get('/completed', ReportController.getCompletedReport);

// Bekleyen Görev Sayısı & Listesi: GET /api/reports/pending
router.get('/pending', ReportController.getPendingReport);

// Genel Sistem Özeti: GET /api/reports/summary
router.get('/summary', ReportController.getSummaryReport);

module.exports = router;
