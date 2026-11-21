package com.clubsphere.config;

import com.clubsphere.security.AuthEntryPointJwt;
import com.clubsphere.security.JwtAuthFilter;
import com.clubsphere.security.UserDetailsServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final AuthEntryPointJwt unauthorizedHandler;
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*", "http://[::1]:*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With", "Origin"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            Map<String, Object> body = new HashMap<>();
            body.put("success", false);
            body.put("message", "Access Denied: You do not have permission to access this resource");
            body.put("path", request.getServletPath());
            new ObjectMapper().writeValue(response.getOutputStream(), body);
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(unauthorizedHandler)
                .accessDeniedHandler(accessDeniedHandler())
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/memberships/plans/**").permitAll()
                .requestMatchers("/api/integration/**").permitAll() // Integrations for Swathi, Balaji & Anish
                .requestMatchers("/v3/api-docs/**", "/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/error").permitAll()
                // Public Website & Discovery Endpoints
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/promotions/**").permitAll()
                .requestMatchers("/api/shops/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/courts/**").permitAll()
                .requestMatchers("/api/enquiries/**", "/api/trial-bookings/**").permitAll()
                .requestMatchers("/api/social-play/**").permitAll()
                .requestMatchers("/api/notifications/**").authenticated()
                // Users
                .requestMatchers("/api/users/profile", "/api/users/change-password").authenticated()
                .requestMatchers("/api/users/**").hasRole("ADMIN")
                // Staff endpoints accessible by both ADMIN and STAFF:
                .requestMatchers(
                    "/api/staff/me",
                    "/api/staff/departments",
                    "/api/staff/attendance",
                    "/api/staff/attendance/history",
                    "/api/staff/leaves/apply",
                    "/api/staff/leaves/my",
                    "/api/staff/shifts",
                    "/api/staff/shifts/schedules"
                ).hasAnyRole("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.GET, "/api/staff/*").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/api/staff/**").hasRole("ADMIN")
                // Memberships
                .requestMatchers("/api/memberships/my", "/api/memberships/register", "/api/memberships/*/renew", "/api/memberships/*/upgrade", "/api/memberships/*/card").authenticated()
                .requestMatchers("/api/memberships/dashboard", "/api/memberships/all", "/api/memberships/verify/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/api/memberships/**").hasRole("ADMIN")
                // Court & Booking Management
                .requestMatchers("/api/bookings/check-in", "/api/bookings/*/check-in").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.POST, "/api/bookings").permitAll()
                .requestMatchers("/api/bookings/**").authenticated()
                .requestMatchers("/api/courts/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
