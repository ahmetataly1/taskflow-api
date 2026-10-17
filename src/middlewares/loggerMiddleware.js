const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '..', '..', 'logs');
const logFilePath = path.join(logDirectory, 'access.log');

// Log dizini yoksa oluştur
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Log dosyasına stream ile yazma
const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });

/**
 * HTTP İstek Logger Middleware
 * Slayt Aşama 3 gereksinimi:
 * Her isteğin HTTP methodu, endpoint URL'si, yanıt kodu, süresi ve ISO zaman damgası konsola ve logs/access.log dosyasına kaydedilir.
 */
function loggerMiddleware(req, res, next) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  const { method, originalUrl } = req;

  // Yanıt tamamlandığında logla
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const logLine = `[${timestamp}] ${method} ${originalUrl} | Status: ${statusCode} | ${duration}ms`;

    // Konsol çıktısı
    console.log(`📡 ${logLine}`);

    // Dosyaya kayıt
    accessLogStream.write(logLine + '\n');
  });

  next();
}

module.exports = loggerMiddleware;
