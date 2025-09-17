# 🚀 Real-Time Chat Application

Веб-приложение для обмена сообщениями в реальном времени с использованием NestJS, Angular и WebSockets.

## 🏗️ Архитектура

- **Backend**: NestJS + Socket.IO + TypeScript
- **Frontend**: Angular 17 + Signals + WebSocket

## 📦 Структура проекта

```text
project/
├── server/ # NestJS backend
│ ├── src/
│ ├── Dockerfile
│ ├── package.json
│ └── ...
├── frontend/ # Angular frontend
│ ├── src/
│ ├── Dockerfile
│ ├── nginx.conf
│ ├── package.json
│ └── ...
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🚀 Быстрый старт

### Предварительные требования

- Docker Desktop
- Docker Compose

### Запуск через Docker (рекомендуется)

1. **Клонируйте репозиторий**:
```bash
  git clone https://github.com/tyskanhik/chat_WebSocket-.git
  cd project
```
   
2. **Запустите в режиме разработки**:
  ```bash
	docker-compose up
  ```

3. **Откройте приложение**:
```bash
	http://localhost:4200
```

## 🎯 Функциональность

- 🔐 Установка имени пользователя 
- 💬 Обмен сообщениями в реальном времени
- 👥 Отслеживание активных пользователей
- 📋 История сообщений
- 🌐 WebSocket соединения
- 🎨 Адаптивный UI
- ⚡ Быстрые реакции через Angular Signals

## 🔧 Технологии

### Backend

- NestJS - фреймворк для Node.js
- Socket.IO - WebSocket библиотека
- class-validator - валидация DTO
- TypeScript - типизированный JavaScript

### Frontend

- Angular 17 - фреймворк для SPA
- Socket.IO Client - WebSocket клиент
- Angular Signals - реактивное состояние
- SCSS - препроцессор CSS