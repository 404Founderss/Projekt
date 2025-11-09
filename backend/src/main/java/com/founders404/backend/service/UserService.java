package com.founders404.backend.service;

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
    private final PasswordEncoder passwordEncoder; // Dependency injection-nel jön majd

    /**
     * Új felhasználó regisztrálása.
     * @throws RuntimeException ha a username már létezik
     */
    public void register(User user) {
        // Ellenőrizzük, hogy létezik-e már ilyen username
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Ha nincs role beállítva, alapértelmezett legyen USER
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        // Jelszó hash-elés
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    /**
     * Bejelentkezés és JWT token generálás.
     * @return JWT token string
     * @throws RuntimeException ha hibás a username vagy password
     */

    public String login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Token generálás a username és role alapján
        return jwtUtil.generateToken(username, user.getRole());
    }

    /**
     * Felhasználó keresése username alapján (opcionális, ha kellene).
     */
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}