const TaskModel = require('../models/taskModel');

class TaskController {
  /**
   * 1. Tüm görevleri listeler (Arama, filtreleme, sıralama ve sayfalama destekli)
   * GET /api/tasks
   * GET /api/tasks?status=completed
   * GET /api/tasks?priority=high
   * GET /api/tasks?assignee=musa
   * GET /api/tasks?sort=createdAt&order=desc
   * GET /api/tasks?page=1&limit=10
   */
  static async getAllTasks(req, res, next) {
    try {
      const { status, priority, assignee, keyword, sort, order, page, limit } = req.query;

      const result = await TaskModel.getAll({
        status,
        priority,
        assignee,
        keyword,
        sort,
        order,
        page,
        limit
      });

      return res.status(200).json({
        success: true,
        count: result.data.length,
        pagination: result.pagination || null,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 2. ID ile tekil görev detayını getirir
   * GET /api/tasks/:id
   */
  static async getTaskById(req, res, next) {
    try {
      const { id } = req.params;
      const task = await TaskModel.getById(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: `'${id}' kimlikli görev bulunamadı.`
        });
      }

      return res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 3. Yeni görev ekler
   * POST /api/tasks
   */
  static async createTask(req, res, next) {
    try {
      const { title, description, priority, assignee, status } = req.body;

      const newTask = await TaskModel.create({
        title,
        description,
        priority,
        assignee,
        status
      });

      return res.status(201).json({
        success: true,
        message: 'Görev başarıyla oluşturuldu.',
        data: newTask
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 4. Görev bilgilerini günceller
   * PUT /api/tasks/:id veya PATCH /api/tasks/:id
   */
  static async updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const updatedTask = await TaskModel.update(id, req.body);

      if (!updatedTask) {
        return res.status(404).json({
          success: false,
          message: `'${id}' kimlikli görev güncellenemedi çünkü bulunamadı.`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Görev başarıyla güncellendi.',
        data: updatedTask
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 5. Görevi siler
   * DELETE /api/tasks/:id
   */
  static async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const deletedTask = await TaskModel.delete(id);

      if (!deletedTask) {
        return res.status(404).json({
          success: false,
          message: `'${id}' kimlikli görev silinemedi çünkü bulunamadı.`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Görev sistemden başarıyla silindi.',
        data: deletedTask
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * İsteğe Bağlı 01: Görev Arama
   * GET /api/tasks/search?keyword=backend
   */
  static async searchTasks(req, res, next) {
    try {
      const { keyword } = req.query;

      if (!keyword || keyword.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "Arama yapmak için 'keyword' parametresi gereklidir. Örn: /tasks/search?keyword=backend"
        });
      }

      const results = await TaskModel.search(keyword);

      return res.status(200).json({
        success: true,
        keyword,
        count: results.length,
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * İsteğe Bağlı 01: Kullanıcı Bazlı Listeleme
   * GET /api/tasks/assignee/:name (Örn: /tasks/assignee/musa)
   */
  static async getTasksByAssignee(req, res, next) {
    try {
      const { name } = req.params;
      const tasks = await TaskModel.getByAssignee(name);

      return res.status(200).json({
        success: true,
        assignee: name,
        count: tasks.length,
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskController;
