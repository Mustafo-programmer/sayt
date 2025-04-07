const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

// Настройка CORS
app.use(cors({ origin: 'http://127.0.0.1:5500' })); // Убедитесь, что источник клиента указан правильно

// Настройка директории для загрузки логотипов
const uploadDirectory = path.join(__dirname, 'uploads'); // Путь к папке uploads в корне проекта
app.use('/uploads', express.static(uploadDirectory)); // Делаем папку доступной для веб-клиентов

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Указываем правильную папку для сохранения файлов
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Получаем расширение файла
    const filename = `${Date.now()}${ext}`; // Генерируем уникальное имя для файла
    cb(null, filename);
  }
});

// Инициализация multer
const upload = multer({ storage });

// Маршрут для загрузки логотипов
app.post('/upload-logo', upload.single('logo'), (req, res) => {
  console.log(req.file);  // Логируем загруженный файл для диагностики

  if (!req.file) {
    return res.status(400).json({ message: 'Нет файла для загрузки' });
  }

  const logoUrl = `/uploads/${req.file.filename}`; // URL для загруженного файла
  console.log(`Файл загружен: ${logoUrl}`);
  res.json({ url: logoUrl });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
