package com.clubsphere.common.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CorsConfig — Spring Web MVC CORS configuration.
 *
 * Implements WebMvcConfigurer to configure cross-origin mappings for Spring MVC controllers,
 * allowing frontend applications running on http://localhost:3000 (React standard)
 * and http://localhost:5173 (Vite development server) to access endpoints under /api/**.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Configures cross-origin request handling for Spring MVC endpoints.
     *
     * @param registry CorsRegistry to add CORS mappings to
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
