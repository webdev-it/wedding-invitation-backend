const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 50, // максимум 50 запросов с одного IP за 15 минут
    message: 'Слишком много запросов с этого IP, попробуйте позже.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS настройки для продакшн
const corsOptions = {
    origin: [
        'https://felixme.online',
        'https://www.felixme.online',
        'http://felixme.online',
        'http://www.felixme.online',
        'https://webdev-it.github.io',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-test-mode']
};

app.use(cors(corsOptions));

// Функция создания email транспортера  
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER || 'minecraftpedit66@gmail.com',
            pass: process.env.EMAIL_PASS || 'your-app-password'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Валидация данных формы
const validateForm = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Имя должно быть от 2 до 100 символов')
        .matches(/^[а-яёa-zàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ\s\-\.\']+$/i)
        .withMessage('Имя может содержать только буквы, пробелы, дефисы и точки'),
    
    body('attendance')
        .isIn(['Буду присутствовать', 'Не смогу присутствовать', 'Пока не знаю'])
        .withMessage('Некорректный статус присутствия'),
    
    body('wishes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Пожелания не должны превышать 500 символов')
];

// Главная страница API
app.get('/', (req, res) => {
    res.json({
        message: '💒 Wedding Invitation Backend',
        status: 'active',
        version: '1.1.0-simplified',
        endpoints: {
            submit: 'POST /api/submit-form',
            health: 'GET /api/health'
        },
        wedding: {
            couple: 'Икромхудзя & Сарвиноз',
            date: '6 октября 2025',
            time: '18:00',
            venue: 'Ресторан «Базморо»'
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Основной endpoint для отправки формы
app.post('/api/submit-form', validateForm, async (req, res) => {
    try {
        console.log('📝 Получены данные формы:', req.body);
        
        // Проверка валидации
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('❌ Ошибки валидации:', errors.array());
            return res.status(400).json({
                success: false,
                message: 'Ошибки валидации данных',
                errors: errors.array()
            });
        }

        const { name, attendance, wishes } = req.body;
        const timestamp = new Date();
        
        console.log(`✅ Валидация пройдена для: ${name} - ${attendance}`);

        // Отправка письма (только если не в тестовом режиме)
        if (process.env.NODE_ENV === 'test' || req.headers['x-test-mode'] === 'true') {
            console.log('🧪 ТЕСТОВЫЙ РЕЖИМ: Письмо не отправляется');
            console.log(`📋 Данные для отправки: ${name} - ${attendance}`);
            
            // Успешный ответ в тестовом режиме
            res.json({
                success: true,
                message: 'Ваша заявка успешно получена! (тестовый режим)',
                data: {
                    name,
                    attendance,
                    submitted_at: timestamp.toISOString()
                }
            });
        } else {
            // Реальная отправка письма - простая версия
            const transporter = createTransporter();
            
            // Простые параметры письма (только текст)
            const mailOptions = {
                from: {
                    name: 'Свадебное приглашение',
                    address: process.env.EMAIL_USER || 'minecraftpedit66@gmail.com'
                },
                to: process.env.RECIPIENT_EMAIL || 'abdumalikabdumalikov72@gmail.com',
                subject: `💒 Новая заявка на свадьбу от ${name}`,
                text: `
НОВАЯ ЗАЯВКА НА СВАДЬБУ

👤 Имя гостя: ${name}
✅ Статус присутствия: ${attendance}
💌 Пожелания молодоженам: ${wishes || 'Пожелания не указаны'}

📅 Дата отправки: ${timestamp.toLocaleString('ru-RU')}

---
💒 Свадьба: Икромхуджа & Сарвиноз
📅 Дата: 6 октября 2025
🕕 Время: 18:00
🏛️ Место: Ресторан «Базморо»

Автоматическое уведомление от системы свадебных приглашений
                `.trim()
            };

            await transporter.sendMail(mailOptions);

            // Логирование на сервере
            console.log(`✅ Заявка отправлена: ${name} - ${attendance}`);
            console.log(`📧 Email отправлен на: ${mailOptions.to}`);
            console.log(`⏰ Время: ${timestamp.toLocaleString('ru-RU')}`);

            // Успешный ответ
            res.json({
                success: true,
                message: 'Ваша заявка успешно отправлена!',
                data: {
                    name,
                    attendance,
                    submitted_at: timestamp.toISOString()
                }
            });
        }

    } catch (error) {
        console.error('❌ Ошибка в /api/submit-form:', error);
        
        res.status(500).json({
            success: false,
            message: 'Произошла ошибка при отправке заявки. Попробуйте позже.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// 404 обработчик
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint не найден',
        availableEndpoints: [
            'GET /',
            'GET /api/health', 
            'POST /api/submit-form'
        ]
    });
});

// Обработчик ошибок
app.use((error, req, res, next) => {
    console.error('Необработанная ошибка сервера:', error);
    res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера'
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`
============================================================
🚀 Wedding Invitation Backend (Simplified) запущен!
📡 Сервер работает на порту: ${PORT}
🌐 URL: ${PORT === 3000 ? 'https://wedding-invitation-backend-lj0d.onrender.com' : `http://localhost:${PORT}`}
📧 Email отправляется на: ${process.env.RECIPIENT_EMAIL || 'abdumalikabdumalikov72@gmail.com'}
💒 Свадьба: Икромхуджа & Сарвиноз
📅 Дата: 6 октября 2025 в 18:00
============================================================
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔄 Получен сигнал SIGINT. Завершение работы сервера...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🔄 Получен сигнал SIGTERM. Завершение работы сервера...');
    process.exit(0);
});