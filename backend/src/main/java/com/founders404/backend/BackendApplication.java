package com.founders404.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {
    public static void main(String[] args) {
        // Load environment variables with fallbacks for development
        String dbUsername = System.getenv("DB_USERNAME");
        String dbPassword = System.getenv("DB_PASSWORD");
        String jwtSecret = System.getenv("JWT_SECRET");

        // Set defaults for development if env vars not provided
        if (dbUsername != null) System.setProperty("DB_USERNAME", dbUsername);
        else System.setProperty("DB_USERNAME", "sa");

        if (dbPassword != null) System.setProperty("DB_PASSWORD", dbPassword);
        else System.setProperty("DB_PASSWORD", "sa");

        if (jwtSecret != null) System.setProperty("JWT_SECRET", jwtSecret);
        else System.setProperty("JWT_SECRET", "dev_jwt_secret_change_in_production");

        SpringApplication.run(BackendApplication.class, args);
    }
}