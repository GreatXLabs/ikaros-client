# Use official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory to /app
WORKDIR /app

# Copy the gradlew, gradle directory and the source code
COPY gradlew .
COPY gradle gradle
COPY . .

# Make gradlew executable
RUN chmod +x gradlew

# Build the application
RUN ./gradlew build --no-daemon

# Expose the port the app runs on
EXPOSE 8080

# Set environment variables with defaults, can be overridden at runtime
ENV JAVA_APP_PORT=8080
ENV SERVER_PORT=${JAVA_APP_PORT}
ENV SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/ikaros
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=root
ENV SPRING_PROFILES_ACTIVE=cloud

# Run the jar file
ENTRYPOINT ["java", "-jar", "build/libs/ikaros-gateway-*.jar"]