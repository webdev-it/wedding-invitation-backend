# 💒 Wedding Invitation - Quick Setup Guide

## 🎯 Текущая конфигурация

- **Frontend**: `https://webdev-it.github.io/felixme/wedding/` ✅ (ваш GitHub Pages)
- **Backend**: Нужно развернуть на Render.com 

## 🚀 Быстрые шаги

### 1️⃣ Загрузить файлы на GitHub Pages

Скопируйте из папки `frontend/` в вашу папку `/felixme/wedding/`:

```
📁 felixme/wedding/
├── index.html      ← frontend/index.html
├── success.html    ← frontend/success.html  
├── styles.css      ← frontend/styles.css
├── script.js       ← frontend/script.js
└── bg_music/
    └── bg_music.mp3 ← frontend/bg_music/bg_music.mp3
```

### 2️⃣ Развернуть Backend

1. **Создать репозиторий** `webdev-it/wedding-invitation-backend`
2. **Загрузить файлы**: `server.js`, `package.json`, `.env.example`
3. **Render.com** → подключить репозиторий
4. **Настроить переменные**:
   - `EMAIL_USER=minecraftpedit66@gmail.com`
   - `EMAIL_PASS=YOUR_APP_PASSWORD` (из Gmail)
   - `RECIPIENT_EMAIL=abdumalikabdumalikov72@gmail.com`

### 3️⃣ Настроить Gmail App Password

1. **Google Account** → Безопасность → Двухфакторная аутентификация
2. **Пароли приложений** → Создать для "Wedding Backend"
3. **Скопировать пароль** в Render Environment Variables

## ✅ Результат

- **Свадебное приглашение**: https://webdev-it.github.io/felixme/wedding/
- **Backend API**: https://wedding-invitation-backend.onrender.com
- **Полностью бесплатно**: $0/месяц

## 📧 Что происходит

1. Гость заполняет форму на вашем сайте
2. Данные отправляются на Render backend  
3. Backend валидирует данные и отправляет красивый email
4. Email приходит на `abdumalikabdumalikov72@gmail.com`

---

**Подробные инструкции**: см. `DEPLOYMENT.md`