package com.founders404.backend.controller;

import com.founders404.backend.dto.LoginRequest;
import com.founders404.backend.dto.LoginResponse;
import com.founders404.backend.dto.RegisterRequest;
import com.founders404.backend.model.Role;
import com.founders404.backend.model.User;
import com.founders404.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST API endpointok login és regisztráció kezeléséhez.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    /**
     * Felhasználó regisztrációja.
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());

            // Role beállítása - String-ből Role enum-má konvertálás
            if (request.getRole() != null) {
                user.setRole(Role.valueOf(request.getRole()));
            } else {
                user.setRole(Role.WAREHOUSE_WORKER); // Alapértelmezett
            }

            userService.register(user);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "User registered successfully",
                            "username", user.getUsername()
                    ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid role: " + request.getRole()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Bejelentkezés és JWT token lekérése.
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody LoginRequest request) {
        try {
            String token = userService.login(request.getUsername(), request.getPassword());
            User user = userService.findByUsername(request.getUsername());

            LoginResponse response = new LoginResponse(
                    token,
                    user.getUsername(),
                    user.getRole().name() // Role enum -> String konverzió
            );

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }
    }

    /**
     * Token validálás.
     * GET /api/auth/validate
     */
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Boolean>> validateToken() {
        return ResponseEntity.ok(Map.of("valid", true));
    }
}