package com.founders404.backend.controller;

import com.founders404.backend.dto.LoginRequest;
import com.founders404.backend.dto.LoginResponse;
import com.founders404.backend.dto.RegisterRequest;
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
     * Body: { "username": "...", "password": "...", "role": "USER" }
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = new User();
            user.setUsername(request.getUsername());
            user.setPassword(request.getPassword());
            user.setRole(request.getRole() != null ? request.getRole() : "USER");

            userService.register(user);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "User registered successfully",
                            "username", user.getUsername()
                    ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Bejelentkezés és JWT token lekérése.
     * POST /api/auth/login
     * Body: { "username": "...", "password": "..." }
     * Response: { "token": "...", "username": "...", "role": "..." }
     */
    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody LoginRequest request) {
        try {
            String token = userService.login(request.getUsername(), request.getPassword());
            User user = userService.findByUsername(request.getUsername());

            LoginResponse response = new LoginResponse(
                    token,
                    user.getUsername(),
                    user.getRole()
            );

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }
    }

    /**
     * Token validálás (opcionális endpoint).
     * GET /api/auth/validate
     * Header: Authorization: Bearer <token>
     */
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Boolean>> validateToken() {
        // A JwtAuthenticationFilter már validálta a tokent
        // Ha idáig eljutottunk, akkor valid a token
        return ResponseEntity.ok(Map.of("valid", true));
    }
}