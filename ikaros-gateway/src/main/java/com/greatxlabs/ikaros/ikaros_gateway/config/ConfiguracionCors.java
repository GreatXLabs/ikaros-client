package com.greatxlabs.ikaros.ikaros_gateway.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class ConfiguracionCors implements WebMvcConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(ConfiguracionCors.class);

    @Value("${ikaros.cors.allowed-origins}")
    private String origenesPermitidos;

    @PostConstruct
    public void logOrigins() {
        Arrays.stream(origenesPermitidos.split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .forEach(o -> logger.info("CORS: origen permitido → {}", o));
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] origins = Arrays.stream(origenesPermitidos.split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .toArray(String[]::new);

        registry.addMapping("/**")
            .allowedOrigins(origins)
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
