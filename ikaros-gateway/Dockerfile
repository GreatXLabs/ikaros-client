# Use Gradle image to build the application
FROM gradle:8.5-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle build --no-daemon

# Use Eclipse Temurin JRE for runtime (smaller than full JDK)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/ikaros-gateway-*.jar ./app.jar
EXPOSE 8080
ENV JAVA_APP_PORT=8080
ENV SERVER_PORT=${JAVA_APP_PORT}
ENV SPRING_PROFILE=cloud
ENTRYPOINT ["java", "-jar", "/app/app.jar"]