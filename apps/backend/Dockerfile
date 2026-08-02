# Multi-stage Dockerfile for Spring Boot Backend
FROM maven:3.9.11-eclipse-temurin-21 AS build

WORKDIR /workspace

# Dependency layer caching
COPY pom.xml .
RUN mvn --batch-mode --no-transfer-progress dependency:go-offline

# Source compilation and packaging
COPY src ./src
RUN mvn --batch-mode --no-transfer-progress -DskipTests package

# Production minimal runtime image
FROM eclipse-temurin:21-jre

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /workspace/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Security: Non-root system user
RUN useradd --system --uid 10001 appuser
USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
    CMD curl --fail --silent http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
