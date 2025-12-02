package com.founders404.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // JWT használatánál nem kell CSRF védelem
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS engedélyezése
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless, mert JWT-t használunk
                .authorizeHttpRequests(auth -> auth
                        // Nyilvános endpointok (nem kell token)
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll() // H2 console hozzáférés (fejlesztéshez)
                        .requestMatchers("/error").permitAll()

                        // Védett endpointok (JWT token kell)
                        .requestMatchers("/api/products/**").authenticated()
                        .requestMatchers("/api/inventory/**").authenticated()
                        .requestMatchers("/api/notifications/**").authenticated()

                        // Minden más endpoint védelme
                        .anyRequest().authenticated()
                )
                // JWT filter hozzáadása a security chain-hez
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // H2 console működéséhez (csak fejlesztéshez!)
        http.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

        return http.build();
    }

    /**
     * CORS konfiguráció - React frontend számára.
     * FONTOS: Production-ben csak a konkrét domain-t engedélyezd!
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Fejlesztéshez: localhost:3000
        // Production-ben cseréld le a konkrét domain-re!
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));

        // Engedélyezett HTTP metódusok
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Engedélyezett headerek
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));

        // Credentials engedélyezése (cookie-k, authorization headerek)
        configuration.setAllowCredentials(true);

        // Expose headers a frontendnek
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * PasswordEncoder bean - BCrypt használata.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}