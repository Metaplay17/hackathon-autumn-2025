# Используем официальный OpenJDK как базовый образ
FROM eclipse-temurin:17

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем JAR-файл (он должен быть собран заранее)
COPY target/booking-1.0-SNAPSHOT.jar app.jar

# Экспонируем порт (по умолчанию Spring Boot использует 8080)
EXPOSE 8080

# Запускаем приложение
ENTRYPOINT ["java", "-jar", "app.jar"]