/**
 * Bulunamayan rotalar (404 Not Found) yakalayıcı
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Kaynak bulunamadı: ${req.method} ${req.originalUrl}`
  });
}

/**
 * Global Hata Yakalayıcı Middleware (500 Internal Server Error)
 */
function globalErrorHandler(err, req, res, next) {
  console.error('❌ Sunucu Hatası:', err);
  res.status(err.status || 500).json({
    success: false,
    message: 'Sunucu tarafında beklenmeyen bir hata oluştu.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
