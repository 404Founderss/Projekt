package com.founders404.backend.service;

import com.founders404.backend.model.Person;
import com.founders404.backend.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonService {

    private final PersonRepository personRepository;

    /**
     * Összes személy lekérése.
     */
    public List<Person> findAll() {
        return personRepository.findAll();
    }

    /**
     * Személy lekérése ID alapján.
     * @throws RuntimeException ha nem található
     */
    public Person findById(Long id) {
        return personRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Person not found!"));
    }

    /**
     * Személy keresése email alapján.
     * @throws RuntimeException ha nem található
     */
    public Person findByEmail(String email) {
        return personRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Person not found!"));
    }

    /**
     * Aktív személyek lekérése.
     */
    public List<Person> findAllActive() {
        return personRepository.findByIsActiveTrue();
    }

    /**
     * Személyek keresése név alapján.
     */
    public List<Person> searchByName(String name) {
        return personRepository.findByFullNameContainingIgnoreCase(name);
    }

    /**
     * Új személy létrehozása.
     * @throws RuntimeException ha az email már létezik
     */
    @Transactional
    public Person create(Person person) {
        // Ellenőrizzük, hogy létezik-e már ilyen email
        if (person.getEmail() != null && personRepository.existsByEmail(person.getEmail())) {
            throw new RuntimeException("Email already exists: " + person.getEmail());
        }

        return personRepository.save(person);
    }

    /**
     * Személy frissítése.
     * @throws RuntimeException ha nem található vagy email már létezik
     */
    @Transactional
    public Person update(Long id, Person personDetails) {
        Person person = findById(id);

        // Email ellenőrzés (ha változik és már létezik)
        if (personDetails.getEmail() != null
                && !personDetails.getEmail().equals(person.getEmail())
                && personRepository.existsByEmail(personDetails.getEmail())) {
            throw new RuntimeException("Email already exists: " + personDetails.getEmail());
        }

        // Mezők frissítése
        if (personDetails.getFullName() != null) {
            person.setFullName(personDetails.getFullName());
        }
        if (personDetails.getLastName() != null) {
            person.setLastName(personDetails.getLastName());
        }
        if (personDetails.getEmail() != null) {
            person.setEmail(personDetails.getEmail());
        }
        if (personDetails.getPhone() != null) {
            person.setPhone(personDetails.getPhone());
        }
        if (personDetails.getIsActive() != null) {
            person.setIsActive(personDetails.getIsActive());
        }

        return personRepository.save(person);
    }

    /**
     * Személy törlése (soft delete - is_active = false).
     */
    @Transactional
    public void deactivate(Long id) {
        Person person = findById(id);
        person.setIsActive(false);
        personRepository.save(person);
    }

    /**
     * Személy végleges törlése az adatbázisból.
     */
    @Transactional
    public void delete(Long id) {
        Person person = findById(id);
        personRepository.delete(person);
    }
}
