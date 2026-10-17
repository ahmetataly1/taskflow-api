const fs = require('fs').promises;
const path = require('path');

const DATA_FILE_PATH = path.join(__dirname, '..', '..', 'data', 'tasks.json');

/**
 * Görevleri JSON dosyasından asenkron olarak okur.
 * Dosya yoksa veya bozuksa boş dizi döndürür.
 */
async function readTasksFromFile() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeTasksToFile([]);
      return [];
    }
    throw error;
  }
}

/**
 * Görevleri JSON dosyasına formatlı şekilde asenkron yazar.
 */
async function writeTasksToFile(tasks) {
  const dir = path.dirname(DATA_FILE_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(tasks, null, 2), 'utf-8');
}

module.exports = {
  readTasksFromFile,
  writeTasksToFile,
  DATA_FILE_PATH
};
