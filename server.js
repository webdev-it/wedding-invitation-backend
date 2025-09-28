const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка безопасности
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'", "'unsafe-inline'"]
        }
    }
}));

// CORS настройки для работы с GitHub Pages
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:8000',
        'https://webdev-it.github.io', // Ваш GitHub Pages домен
        'https://webdev-it.github.io/felixme/wedding', // Полный путь к свадебному приглашению
        'https://wedding-invitation-backend.onrender.com' // Backend URL для самотестирования
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 10, // максимум 10 запросов с одного IP
    message: {
        error: 'Слишком много запросов, попробуйте позже'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Применяем rate limiting только к POST запросам
app.use('/api/submit-form', limiter);

// Конфигурация почты
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'minecraftpedit66@gmail.com',
            pass: process.env.EMAIL_PASS || 'your-app-password' // App Password!
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
        .matches(/^[а-яё\s\-\.]+$/i)
        .withMessage('Имя должно содержать только русские буквы'),
    
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
        version: '1.0.0',
        endpoints: {
            submit: 'POST /api/submit-form',
            health: 'GET /api/health'
        },
        wedding: {
            couple: 'Икромхуджа & Сарвиноз',
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
        // Проверка валидации
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, attendance, wishes } = req.body;
        const timestamp = new Date();

        // Создаем HTML письмо
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    line-height: 1.6; 
                    color: #2c2c2c; 
                    background: #f8f6f0;
                    margin: 0;
                    padding: 20px;
                }
                .container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: white;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                .header { 
                    text-align: center; 
                    padding: 30px 20px; 
                    background: linear-gradient(135deg, #8B4513, #654321); 
                    color: white;
                }
                .monogram { 
                    font-size: 3.5rem; 
                    margin-bottom: 10px; 
                    font-weight: bold;
                }
                .content {
                    padding: 30px;
                }
                .form-data { 
                    background: #f9f7f4; 
                    padding: 25px; 
                    border-radius: 10px; 
                    margin: 20px 0; 
                    border-left: 5px solid #8B4513; 
                }
                .field { 
                    margin: 20px 0; 
                    padding-bottom: 15px;
                    border-bottom: 1px solid #eee;
                }
                .field:last-child {
                    border-bottom: none;
                }
                .label { 
                    font-weight: bold; 
                    color: #654321; 
                    font-size: 1.1rem;
                    margin-bottom: 8px;
                }
                .value { 
                    background: white; 
                    padding: 15px; 
                    border-radius: 8px; 
                    border: 1px solid #ddd;
                    font-size: 1rem;
                }
                .footer { 
                    text-align: center; 
                    padding: 25px; 
                    background: #f9f7f4; 
                    color: #654321;
                    border-top: 2px solid #8B4513;
                }
                .wedding-details {
                    margin: 15px 0;
                    font-size: 1.1rem;
                }
                .highlight {
                    color: #8B4513;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="monogram">И & С</div>
                    <h2>Новая заявка на свадьбу</h2>
                    <p><strong>Получено:</strong> ${timestamp.toLocaleString('ru-RU')}</p>
                </div>
                
                <div class="content">
                    <h3 style="color: #654321; text-align: center; margin-bottom: 25px;">Данные гостя</h3>
                    
                    <div class="form-data">
                        <div class="field">
                            <div class="label">👤 Имя гостя:</div>
                            <div class="value">${name}</div>
                        </div>
                        
                        <div class="field">
                            <div class="label">✅ Статус присутствия:</div>
                            <div class="value ${attendance === 'Буду присутствовать' ? 'highlight' : ''}">${attendance}</div>
                        </div>
                        
                        <div class="field">
                            <div class="label">💌 Пожелания молодоженам:</div>
                            <div class="value">${wishes || 'Пожелания не указаны'}</div>
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <div class="wedding-details">
                        <p><strong>💒 Свадьба:</strong> <span class="highlight">Икромхуджа & Сарвиноз</span></p>
                        <p><strong>📅 Дата:</strong> <span class="highlight">6 октября 2025</span></p>
                        <p><strong>🕕 Время:</strong> <span class="highlight">18:00</span></p>
                        <p><strong>🏛️ Место:</strong> <span class="highlight">Ресторан «Базморо»</span></p>
                    </div>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                    <p style="margin: 0; font-style: italic;">
                        Автоматическое уведомление от системы свадебных приглашений
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Настройка почты
        const transporter = createTransporter();

        // Параметры письма
        const mailOptions = {
            from: {
                name: 'Свадебное приглашение',
                address: process.env.EMAIL_USER || 'minecraftpedit66@gmail.com'
            },
            to: process.env.RECIPIENT_EMAIL || 'abdumalikabdumalikov72@gmail.com',
            subject: `💒 Новая заявка на свадьбу от ${name}`,
            html: htmlContent,
            text: `
Новая заявка на свадьбу

Имя: ${name}
Присутствие: ${attendance}
Пожелания: ${wishes || 'Не указаны'}

Дата отправки: ${timestamp.toLocaleString('ru-RU')}

---
Свадьба Икромхуджи и Сарвиноз
6 октября 2025 в 18:00
Ресторан «Базморо»
            `.trim()
        };

        // Отправка письма
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

    } catch (error) {
        console.error('❌ Ошибка отправки письма:', error);
        
        res.status(500).json({
            success: false,
            message: 'Произошла ошибка при отправке заявки. Попробуйте позже.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Обработка 404 ошибок
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint не найден',
        available_endpoints: {
            submit: 'POST /api/submit-form',
            health: 'GET /api/health'
        }
    });
});

// Глобальная обработка ошибок
app.use((error, req, res, next) => {
    console.error('💥 Глобальная ошибка:', error);
    res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера'
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 Wedding Invitation Backend запущен!');
    console.log(`📡 Сервер работает на порту: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📧 Email отправляется на: ${process.env.RECIPIENT_EMAIL || 'abdumalikabdumalikov72@gmail.com'}`);
    console.log(`💒 Свадьба: Икромхуджа & Сарвиноз`);
    console.log(`📅 Дата: 6 октября 2025 в 18:00`);
    console.log('='.repeat(60) + '\n');
});

module.exports = app;