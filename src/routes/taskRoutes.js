const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');
const { validateTaskCreation, validateTaskUpdate } = require('../middlewares/validationMiddleware');

/**
 * ----------------------------------------------------
 * Özel İleri Seviye Filtre/Arama Rotaları (İsteğe Bağlı 01)
 * (Parametreli :id rotasından önce tanımlanmalıdır)
 * ----------------------------------------------------
 */

// Görev Arama: GET /api/tasks/search?keyword=backend
router.get('/search', TaskController.searchTasks);

// Kullanıcı Bazlı Listeleme: GET /api/tasks/assignee/musa
router.get('/assignee/:name', TaskController.getTasksByAssignee);

/**
 * ----------------------------------------------------
 * Temel CRUD Rotaları (Zorunlu Aşama 03)
 * ----------------------------------------------------
 */

// 1. Görev Listeleme (filtreleme, sıralama, sayfalama destekli): GET /api/tasks
router.get('/', TaskController.getAllTasks);

// 2. Görev Ekleme: POST /api/tasks (Validation Middleware ile korunmaktadır)
router.post('/', validateTaskCreation, TaskController.createTask);

// 3. Görev Detayı: GET /api/tasks/:id
router.get('/:id', TaskController.getTaskById);

// 4. Görev Güncelleme: PUT /api/tasks/:id ve PATCH /api/tasks/:id
router.put('/:id', validateTaskUpdate, TaskController.updateTask);
router.patch('/:id', validateTaskUpdate, TaskController.updateTask);

// 5. Görev Silme: DELETE /api/tasks/:id
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
