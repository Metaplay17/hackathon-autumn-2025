# Stage 1: Build
FROM eclipse-temurin:17-jdk as builder
RUN apt-get update && apt-get install -y maven

WORKDIR /app

# Копируем pom.xml и загружаем зависимости
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Копируем исходный код
COPY src ./src

# Собираем JAR
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre

WORKDIR /app

# Копируем JAR из предыдущего этапа
COPY --from=builder /app/target/booking-1.0-SNAPSHOT.jar app.jar

# Экспонируем порт
EXPOSE 8080

# Запускаем приложение
ENTRYPOINT ["java", "-jar", "app.jar"]