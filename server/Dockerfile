FROM node:20-alpine

WORKDIR /app

# Копируем package files
COPY package*.json ./
COPY package-lock.json* ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Открываем порт
EXPOSE 3000

# Запускаем в режиме разработки через npm scripts
CMD ["npm", "run", "start:dev"]