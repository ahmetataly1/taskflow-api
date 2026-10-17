/**
 * Validation Middleware
 * Slayt İsteğe Bağlı 02 gereksinimi:
 * title, description, priority ve assignee alanlarını denetler.
 * Hatalı/eksik girdide 400 Bad Request ve açıklayıcı hata dizisi döner.
 */

const VALID_PRIORITIES = ['low', 'medium', 'high'];
const VALID_STATUSES = ['pending', 'in-progress', 'completed'];

function validateTaskCreation(req, res, next) {
  const { title, description, priority, assignee, status } = req.body;
  const errors = [];

  // Title doğrulaması
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('title alanı zorunludur ve boş bırakılamaz.');
  } else if (title.trim().length < 3) {
    errors.push('title en az 3 karakter uzunluğunda olmalıdır.');
  }

  // Description doğrulaması
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('description alanı zorunludur ve boş bırakılamaz.');
  } else if (description.trim().length < 5) {
    errors.push('description en az 5 karakter uzunluğunda olmalıdır.');
  }

  // Priority doğrulaması
  if (!priority || typeof priority !== 'string' || priority.trim().length === 0) {
    errors.push('priority alanı zorunludur (low, medium, high).');
  } else if (!VALID_PRIORITIES.includes(priority.toLowerCase().trim())) {
    errors.push(`priority yalnızca 'low', 'medium' veya 'high' olabilir. Gönderilen: '${priority}'`);
  }

  // Assignee doğrulaması
  if (!assignee || typeof assignee !== 'string' || assignee.trim().length === 0) {
    errors.push('assignee (atanan kişi) alanı zorunludur ve boş bırakılamaz.');
  } else if (assignee.trim().length < 2) {
    errors.push('assignee en az 2 karakter uzunluğunda olmalıdır.');
  }

  // Status doğrulaması (isteğe bağlı gönderilmişse)
  if (status && !VALID_STATUSES.includes(status.toLowerCase().trim())) {
    errors.push(`status yalnızca 'pending', 'in-progress' veya 'completed' olabilir. Gönderilen: '${status}'`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Doğrulama hatası: Gönderilen veriler geçersiz veya eksik.',
      errors
    });
  }

  next();
}

function validateTaskUpdate(req, res, next) {
  const { title, description, priority, assignee, status } = req.body;
  const errors = [];

  // Güncellemede en az bir alan gönderilmiş olmalı
  if (
    title === undefined &&
    description === undefined &&
    priority === undefined &&
    assignee === undefined &&
    status === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: 'Güncelleme için en az bir geçerli alan (title, description, priority, assignee, status) belirtilmelidir.'
    });
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length < 3) {
      errors.push('title en az 3 karakter uzunluğunda bir metin olmalıdır.');
    }
  }

  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim().length < 5) {
      errors.push('description en az 5 karakter uzunluğunda bir metin olmalıdır.');
    }
  }

  if (priority !== undefined) {
    if (typeof priority !== 'string' || !VALID_PRIORITIES.includes(priority.toLowerCase().trim())) {
      errors.push(`priority yalnızca 'low', 'medium' veya 'high' olabilir.`);
    }
  }

  if (assignee !== undefined) {
    if (typeof assignee !== 'string' || assignee.trim().length < 2) {
      errors.push('assignee en az 2 karakter uzunluğunda bir metin olmalıdır.');
    }
  }

  if (status !== undefined) {
    if (typeof status !== 'string' || !VALID_STATUSES.includes(status.toLowerCase().trim())) {
      errors.push(`status yalnızca 'pending', 'in-progress' veya 'completed' olabilir.`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Doğrulama hatası: Güncelleme parametreleri geçersiz.',
      errors
    });
  }

  next();
}

module.exports = {
  validateTaskCreation,
  validateTaskUpdate
};
