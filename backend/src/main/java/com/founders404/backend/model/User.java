package com.founders404.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Felhasználó entitás.
 * JPA (Hibernate) kezeli és az adatbázisban tárolódik.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password; // Ez BCrypt hashelt jelszó lesz!

    @Column(nullable = false)
    private String role; // pl. "USER", "ADMIN"
}