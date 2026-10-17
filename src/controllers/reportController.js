const TaskModel = require('../models/taskModel');

class ReportController {
  /**
   * İsteğe Bağlı 03: Tamamlanan Görev Sayısı ve Listesi
   * GET /api/reports/completed
   */
  static async getCompletedReport(req, res, next) {
    try {
      const stats = await TaskModel.getReportStats();

      return res.status(200).json({
        success: true,
        reportType: 'completed_tasks',
        totalCompleted: stats.summary.completedCount,
        data: stats.completedTasks
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * İsteğe Bağlı 03: Bekleyen Görev Sayısı ve Listesi
   * GET /api/reports/pending
   */
  static async getPendingReport(req, res, next) {
    try {
      const stats = await TaskModel.getReportStats();

      return res.status(200).json({
        success: true,
        reportType: 'pending_tasks',
        totalPending: stats.summary.pendingCount,
        data: stats.pendingTasks
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * İsteğe Bağlı 03: Genel Sistem Özeti (İstatistiksel Veri İşleme)
   * GET /api/reports/summary
   */
  static async getSummaryReport(req, res, next) {
    try {
      const stats = await TaskModel.getReportStats();

      return res.status(200).json({
        success: true,
        reportType: 'system_summary',
        generatedAt: new Date().toISOString(),
        overview: stats.summary,
        priorityBreakdown: stats.priorityBreakdown,
        assigneeBreakdown: stats.assigneeBreakdown
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReportController;
