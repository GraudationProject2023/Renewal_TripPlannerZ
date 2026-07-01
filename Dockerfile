FROM gradle:7.6.1-jdk17-alpine AS builder
WORKDIR /backend
COPY build.gradle .
COPY settings.gradle .
COPY gradlew .
COPY gradle gradle
USER root
RUN chmod +x ./gradlew
COPY src src
RUN ./gradlew bootJar


FROM openjdk:17-jdk-alpine
EXPOSE 5000
COPY --from=builder /backend/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-Dspring.profiles.active=prod","-jar","app.jar"]
