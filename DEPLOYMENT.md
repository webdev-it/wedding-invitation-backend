# 🚀 Упрощенная инструкция развертывания

## 📋 Ваша конфигурация

- **Frontend**: `https://webdev-it.github.io/felixme/wedding/` ✅ (готов)
- **Backend**: Развернем на Render.com (бесплатно)

---

## ⚙️ Развертывание Backend на Render.com

### 1️⃣ Создание репозитория для бэкенда

```bash
# В корневой папке проекта (где server.js)
git init
git add server.js package.json .env.example README-backend.md .gitignore
git commit -m "Initial commit: Wedding invitation backend for webdev-it.github.io"

# Создайте репозиторий на GitHub: wedding-invitation-backend  
git remote add origin https://github.com/webdev-it/wedding-invitation-backend.git
git branch -M main
git push -u origin main
```

### 2️⃣ Развертывание на Render.com

1. **Регистрация**: [render.com](https://render.com) (через GitHub)

2. **Создание Web Service**:
   - Нажмите **"New +"** → **"Web Service"**
   - Подключите GitHub репозиторий `webdev-it/wedding-invitation-backend`
   - Name: `wedding-invitation-backend`
   - Region: `Frankfurt (EU Central)`
   - Branch: `main`
   - Runtime: `Node`
   - Build Command: `npm install`  
   - Start Command: `npm start`
   - Plan: **Free** 🆓

3. **Environment Variables** (обязательно!):
   ```
   EMAIL_USER=minecraftpedit66@gmail.com
   EMAIL_PASS=YOUR_GMAIL_APP_PASSWORD
   RECIPIENT_EMAIL=abdumalikabdumalikov72@gmail.com
   NODE_ENV=production
   ```

4. **Нажмите "Create Web Service"**

✅ **Ваш Backend API будет доступен:**
`https://wedding-invitation-backend.onrender.com`

---

## 📧 Настройка Gmail SMTP

### 1️⃣ Создание App Password

1. Откройте [myaccount.google.com](https://myaccount.google.com)
2. **Безопасность** → **Двухэтапная аутентификация** (включите)
3. **Пароли приложений** → **Другое** → "Wedding Backend"
4. **Скопируйте пароль** (16 символов: `abcd-efgh-ijkl-mnop`)

### 2️⃣ Добавление в Render

1. В Render Dashboard → ваш сервис → **Environment**
2. Добавьте: `EMAIL_PASS=abcd-efgh-ijkl-mnop`
3. **Save Changes**

---

## � Загрузка файлов на GitHub Pages

### Загрузите эти файлы в папку `/wedding/` вашего репозитория:

```bash
# Скопируйте эти файлы в папку felixme/wedding/ на GitHub:

📁 wedding/
├── index.html      ← из папки frontend/
├── success.html    ← из папки frontend/  
├── styles.css      ← из папки frontend/
├── script.js       ← из папки frontend/
└── bg_music/
    └── bg_music.mp3 ← из папки frontend/bg_music/
```

---

## ✅ Финальная проверка

### 1️⃣ Откройте ваше приглашение:
**https://webdev-it.github.io/felixme/wedding/**

### 2️⃣ Проверьте API:
**https://wedding-invitation-backend.onrender.com/api/health**

### 3️⃣ Отправьте тестовую форму и проверьте email

---

## 🎯 Финальные URL адреса

```
✅ Свадебное приглашение: https://webdev-it.github.io/felixme/wedding/
✅ Backend API:           https://wedding-invitation-backend.onrender.com
✅ Отправка формы:        https://wedding-invitation-backend.onrender.com/api/submit-form
✅ Health Check:          https://wedding-invitation-backend.onrender.com/api/health
```

---

## 🛠 Troubleshooting

### ❌ Проблема: CORS ошибка
**Решение**: Проверьте что GitHub Pages URL добавлен в CORS origins

### ❌ Проблема: Email не отправляется  
**Решение**: 
- Убедитесь что используете App Password, а не обычный пароль
- Проверьте что двухфакторная аутентификация включена

### ❌ Проблема: 500 ошибка на Render
**Решение**: Проверьте логи в Render Dashboard

### ❌ Проблема: Форма не отправляется
**Решение**: Откройте DevTools → Console и проверьте ошибки

---

## 💰 Стоимость

- **GitHub Pages**: $0/месяц (бесплатно)
- **Render.com**: $0/месяц (free tier) 
- **Gmail SMTP**: $0/месяц (бесплатно)

**Общая стоимость: $0/месяц** 🎉

---

## 🎊 Поздравляем!

Ваше свадебное приглашение теперь доступно всему миру бесплатно! 

💒 **Икромхуджа & Сарвиноз** - пусть ваша свадьба будет незабываемой!