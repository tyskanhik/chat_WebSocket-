FROM node:20-alpine

WORKDIR /app

# Устанавливаем системные зависимости
RUN apk add --no-cache python3 make g++

# Копируем package files
COPY package*.json ./
COPY package-lock.json* ./

# Устанавливаем зависимости
RUN npm ci --silent

# Глобально отключаем analytics
RUN npx ng analytics disable --global

# Копируем исходный код
COPY . .

EXPOSE 4200

# Запускаем напрямую ng serve
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--poll", "1000", "--port", "4200", "--disable-host-check"]