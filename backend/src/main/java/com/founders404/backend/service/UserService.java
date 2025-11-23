package com.founders404.backend.service;

import com.founders404.backend.model.Role;
import com.founders404.backend.model.User;
import com.founders404.backend.repository.UserRepository;
import com.founders404.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * A login és regisztráció logika.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    /**
     * Új felhasználó regisztrálása.
     */
    public void register(User user) {
        // Ellenőrizzük, hogy létezik-e már ilyen username
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Email ellenőrzés
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Ha nincs role beállítva, alapértelmezett legyen WAREHOUSE_WORKER
        if (user.getRole() == null) {
            user.setRole(Role.WAREHOUSE_WORKER);
        }

        // Jelszó hash-elés
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    /**
     * Bejelentkezés és JWT token generálás.
     */
    public String login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Token generálás
        return jwtUtil.generateToken(username, user.getRole().name());
    }

    /**
     * Felhasználó keresése username alapján.
     */
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}