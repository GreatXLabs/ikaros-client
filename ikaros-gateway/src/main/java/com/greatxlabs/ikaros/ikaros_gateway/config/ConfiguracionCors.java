package com.greatxlabs.ikaros.ikaros_gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class ConfiguracionCors {

    @Value("${ikaros.cors.allowed-origins}")
    private String origenesPermitidos;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        if (origenesPermitidos != null && !origenesPermitidos.isEmpty()) {
            String[] originsArray = origenesPermitidos.split(",");
            for (String origin : originsArray) {
                config.addAllowedOrigin(origin.trim());
            }
        }
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}