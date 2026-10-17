const { v4: uuidv4 } = require('uuid');
const { readTasksFromFile, writeTasksToFile } = require('../utils/fileHandler');

class TaskModel {
  /**
   * Tüm görevleri filtreleme, arama, sıralama ve sayfalama parametreleriyle getirir.
   */
  static async getAll({
    status,
    priority,
    assignee,
    keyword,
    sort,
    order = 'desc',
    page,
    limit
  } = {}) {
    let tasks = await readTasksFromFile();

    // 1. Duruma göre filtreleme
    if (status) {
      tasks = tasks.filter(t => t.status.toLowerCase() === status.toLowerCase());
    }

    // 2. Önceliğe göre filtreleme
    if (priority) {
      tasks = tasks.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
    }

    // 3. Atanan kişiye göre filtreleme
    if (assignee) {
      tasks = tasks.filter(t => t.assignee.toLowerCase() === assignee.toLowerCase());
    }

    // 4. Anahtar kelime ile arama
    if (keyword) {
      const searchLower = keyword.toLowerCase();
      tasks = tasks.filter(
        t =>
          (t.title && t.title.toLowerCase().includes(searchLower)) ||
          (t.description && t.description.toLowerCase().includes(searchLower))
      );
    }

    // 5. Sıralama (sort: 'createdAt', 'title', 'priority', 'status')
    if (sort) {
      const sortField = sort;
      const isAsc = order.toLowerCase() === 'asc';

      tasks.sort((a, b) => {
        const valA = a[sortField] || '';
        const valB = b[sortField] || '';

        if (valA < valB) return isAsc ? -1 : 1;
        if (valA > valB) return isAsc ? 1 : -1;
        return 0;
      });
    }

    const totalItems = tasks.length;

    // 6. Sayfalama (Pagination)
    if (page !== undefined || limit !== undefined) {
      const currentPage = Math.max(1, parseInt(page, 10) || 1);
      const perPage = Math.max(1, parseInt(limit, 10) || 10);
      const totalPages = Math.ceil(totalItems / perPage) || 1;
      const startIndex = (currentPage - 1) * perPage;
      const paginatedTasks = tasks.slice(startIndex, startIndex + perPage);

      return {
        data: paginatedTasks,
        pagination: {
          currentPage,
          limit: perPage,
          totalItems,
          totalPages,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1
        }
      };
    }

    return {
      data: tasks,
      totalItems
    };
  }

  /**
   * ID'ye göre tekil görev arar.
   */
  static async getById(id) {
    const tasks = await readTasksFromFile();
    return tasks.find(t => t.id === id) || null;
  }

  /**
   * Belirli bir çalışana atanan görevleri getirir.
   */
  static async getByAssignee(assignee) {
    const tasks = await readTasksFromFile();
    return tasks.filter(t => t.assignee.toLowerCase() === assignee.toLowerCase());
  }

  /**
   * Başlık ve açıklama içinde anahtar kelime araması yapar.
   */
  static async search(keyword) {
    if (!keyword) return [];
    const tasks = await readTasksFromFile();
    const query = keyword.toLowerCase();
    return tasks.filter(
      t =>
        (t.title && t.title.toLowerCase().includes(query)) ||
        (t.description && t.description.toLowerCase().includes(query))
    );
  }

  /**
   * Yeni görev oluşturur.
   */
  static async create({ title, description, priority, assignee, status = 'pending' }) {
    const tasks = await readTasksFromFile();
    const now = new Date().toISOString();

    const newTask = {
      id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: title.trim(),
      description: description.trim(),
      status: status.toLowerCase(),
      priority: priority.toLowerCase(),
      assignee: assignee.trim().toLowerCase(),
      createdAt: now,
      updatedAt: now
    };

    tasks.push(newTask);
    await writeTasksToFile(tasks);
    return newTask;
  }

  /**
   * Var olan görevi günceller.
   */
  static async update(id, updateData) {
    const tasks = await readTasksFromFile();
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) return null;

    const existingTask = tasks[index];
    const updatedTask = {
      ...existingTask,
      ...(updateData.title !== undefined && { title: updateData.title.trim() }),
      ...(updateData.description !== undefined && { description: updateData.description.trim() }),
      ...(updateData.status !== undefined && { status: updateData.status.toLowerCase() }),
      ...(updateData.priority !== undefined && { priority: updateData.priority.toLowerCase() }),
      ...(updateData.assignee !== undefined && { assignee: updateData.assignee.trim().toLowerCase() }),
      updatedAt: new Date().toISOString()
    };

    tasks[index] = updatedTask;
    await writeTasksToFile(tasks);
    return updatedTask;
  }

  /**
   * Görevi sistemden siler.
   */
  static async delete(id) {
    const tasks = await readTasksFromFile();
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) return false;

    const deleted = tasks.splice(index, 1)[0];
    await writeTasksToFile(tasks);
    return deleted;
  }

  /**
   * Raporlama ve istatistik verilerini hesaplar.
   */
  static async getReportStats() {
    const tasks = await readTasksFromFile();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');

    // Öncelik dağılımı
    const priorityBreakdown = {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    };

    // Çalışan dağılımı
    const assigneeBreakdown = {};
    tasks.forEach(t => {
      const user = t.assignee || 'unassigned';
      if (!assigneeBreakdown[user]) {
        assigneeBreakdown[user] = { total: 0, completed: 0, pending: 0, inProgress: 0 };
      }
      assigneeBreakdown[user].total += 1;
      if (t.status === 'completed') assigneeBreakdown[user].completed += 1;
      else if (t.status === 'pending') assigneeBreakdown[user].pending += 1;
      else if (t.status === 'in-progress') assigneeBreakdown[user].inProgress += 1;
    });

    return {
      summary: {
        totalTasks,
        completedCount: completedTasks.length,
        pendingCount: pendingTasks.length,
        inProgressCount: inProgressTasks.length,
        completionRatePercentage: totalTasks > 0 ? Number(((completedTasks.length / totalTasks) * 100).toFixed(2)) : 0
      },
      priorityBreakdown,
      assigneeBreakdown,
      completedTasks,
      pendingTasks
    };
  }
}

module.exports = TaskModel;
