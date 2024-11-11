# Используем базовый образ
FROM node:18-alpine

ARG MODE

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN if [ "$MODE" = "prod" ]; then npm install --production; else npm install; fi

# Копируем остальной исходный код
COPY . .

# Строим проект, но только в prod режиме
RUN if [ "$MODE" = "prod" ]; then npm run build; fi

# Указываем порт
EXPOSE 3000

# Переменная среды для указания режима
ENV NODE_ENV $MODE

# Определяем команду запуска в зависимости от режима
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"dev\" ]; then npm run dev; else npm start; fi"]
