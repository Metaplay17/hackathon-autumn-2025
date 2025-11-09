FROM node:18-alpine

# Установка PM2 глобально
RUN npm install -g pm2

# Создание директории приложения
WORKDIR /home/node/app

# Копирование package.json и установка зависимостей
COPY package*.json ./

# Установка зависимостей, включая TypeScript
RUN npm ci

# Установка TypeScript локально
RUN npm install --save-dev typescript

# Копирование исходного кода
COPY . .

# Сборка проекта
RUN npm run build

# Установка прав доступа (если нужно)
USER node

# Запуск приложения через PM2
CMD ["pm2-runtime", "dist/index.js"]