const express = require('express');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorMiddleware');
const taskRoutes = require('./routes/taskRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Temel Middleware: Custom Logger (Aşama 03)
app.use(loggerMiddleware);

// Kök Bilgi Endpoint'i
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'TaskFlow API',
    description: 'Görev ve Proje Yönetim Sistemi REST API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      tasks: '/api/tasks (veya /tasks)',
      search: '/api/tasks/search?keyword=backend',
      assignee: '/api/tasks/assignee/:name',
      reports: {
        completed: '/api/reports/completed',
        pending: '/api/reports/pending',
        summary: '/api/reports/summary'
      }
    }
  });
});

// Hem standart /api prefix'ini hem de slayttaki doğrudan /tasks ve /reports yollarını destekle
app.use('/api/tasks', taskRoutes);
app.use('/tasks', taskRoutes);

app.use('/api/reports', reportRoutes);
app.use('/reports', reportRoutes);

// 404 Not Found Yakalayıcı
app.use(notFoundHandler);

// Global Hata Yakalayıcı
app.use(globalErrorHandler);

module.exports = app;
