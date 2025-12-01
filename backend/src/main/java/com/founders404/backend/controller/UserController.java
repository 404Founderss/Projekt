package com.founders404.backend.controller;

import com.founders404.backend.dto.ChangePasswordRequest;
import com.founders404.backend.dto.ProfileResponse;
import com.founders404.backend.dto.UpdateProfileRequest;
import com.founders404.backend.model.User;
import com.founders404.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

/**
 * REST API endpointok felhasználói profil kezeléséhez.
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Profilképek tárolási helye
    private static final String UPLOAD_DIR = "uploads/profile-pictures/";

    /**
     * Jelenlegi bejelentkezett felhasználó username-ének lekérése.
     */
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return authentication.getName();
    }

    /**
     * Felhasználó profiljának lekérése.
     * GET /api/user/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile() {
        try {
            String username = getCurrentUsername();
            User user = userService.findByUsername(username);

            ProfileResponse response = new ProfileResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().name(),
                    user.getProfilePicture()
            );

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to retrieve profile: " + e.getMessage());
        }
    }

    /**
     * Profil frissítése (email módosítás).
     * PUT /api/user/profile
     * Body: UpdateProfileRequest
     */
    @PutMapping("/profile")
    public ResponseEntity<Object> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        try {
            String username = getCurrentUsername();
            User updatedUser = userService.updateProfile(username, request.getEmail());

            ProfileResponse response = new ProfileResponse(
                    updatedUser.getId(),
                    updatedUser.getUsername(),
                    updatedUser.getEmail(),
                    updatedUser.getRole().name(),
                    updatedUser.getProfilePicture()
            );

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Jelszó változtatás.
     * PUT /api/user/password
     * Body: ChangePasswordRequest
     */
    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        try {
            String username = getCurrentUsername();
            userService.changePassword(username, request.getOldPassword(), request.getNewPassword());

            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Profilkép feltöltése.
     * POST /api/user/profile-picture
     * Content-Type: multipart/form-data
     * Form field: file
     */
    @PostMapping("/profile-picture")
    public ResponseEntity<Object> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            String username = getCurrentUsername();

            // Fájl validálás
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "File is empty"));
            }

            // Fájl típus ellenőrzés (csak képek)
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Only image files are allowed"));
            }

            // Fájl méret ellenőrzés (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "File size must be less than 5MB"));
            }

            // Könyvtár létrehozása, ha nem létezik
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Egyedi fájlnév generálása
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String newFilename = UUID.randomUUID().toString() + fileExtension;

            // Fájl mentése
            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Fájl URL mentése az adatbázisba
            String fileUrl = "/uploads/profile-pictures/" + newFilename;
            User updatedUser = userService.updateProfilePicture(username, fileUrl);

            ProfileResponse response = new ProfileResponse(
                    updatedUser.getId(),
                    updatedUser.getUsername(),
                    updatedUser.getEmail(),
                    updatedUser.getRole().name(),
                    updatedUser.getProfilePicture()
            );

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
