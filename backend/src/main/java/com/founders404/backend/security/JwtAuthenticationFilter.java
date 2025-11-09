package com.founders404.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT Authentication Filter.
 * Minden HTTP requestnél lefut és ellenőrzi a JWT tokent.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Authorization header kinyerése
        String authHeader = request.getHeader("Authorization");

        // Ha nincs header vagy nem Bearer token, akkor tovább a következő filterre
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Token kinyerése (eltávolítjuk a "Bearer " prefix-et)
            String token = authHeader.substring(7);

            // Username kinyerése a tokenből
            String username = jwtUtil.extractUsername(token);

            // Ha van username és még nincs beállítva authentication
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Token validálás
                if (jwtUtil.validateToken(token, username)) {

                    // Role kinyerése a tokenből
                    String role = jwtUtil.extractRole(token);

                    // Authority létrehozása (ROLE_ prefix kell a Spring Security-nek)
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

                    // Authentication token létrehozása
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    username,
                                    null,
                                    Collections.singletonList(authority)
                            );

                    // Request details beállítása
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Authentication beállítása a Security Context-be
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Token parsing/validálás hiba esetén logolás (opcionális)
            logger.error("JWT Authentication error: " + e.getMessage());
        }

        // Tovább a következő filterre
        filterChain.doFilter(request, response);
    }
}