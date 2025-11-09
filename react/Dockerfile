FROM node:18-alpine

WORKDIR /app

# Сначала копируем файлы с зависимостями
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Затем копируем остальные файлы
COPY . .

# Экспортируем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]