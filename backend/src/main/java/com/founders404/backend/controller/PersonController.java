package com.founders404.backend.controller;

import com.founders404.backend.dto.CreatePersonRequest;
import com.founders404.backend.dto.PersonResponse;
import com.founders404.backend.dto.UpdatePersonRequest;
import com.founders404.backend.model.Person;
import com.founders404.backend.service.PersonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST API endpointok Person entitás kezeléséhez.
 */
@RestController
@RequestMapping("/api/persons")
@RequiredArgsConstructor
public class PersonController {

    private final PersonService personService;

    /**
     * Összes személy lekérése.
     * GET /api/persons
     */
    @GetMapping
    public ResponseEntity<List<PersonResponse>> getAllPersons(
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String search) {

        List<Person> persons;

        if (search != null && !search.isEmpty()) {
            persons = personService.searchByName(search);
        } else if (active != null && active) {
            persons = personService.findAllActive();
        } else {
            persons = personService.findAll();
        }

        List<PersonResponse> response = persons.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * Személy lekérése ID alapján.
     * GET /api/persons/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> getPersonById(@PathVariable Long id) {
        try {
            Person person = personService.findById(id);
            return ResponseEntity.ok(convertToResponse(person));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Személy lekérése email alapján.
     * GET /api/persons/email/{email}
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<Object> getPersonByEmail(@PathVariable String email) {
        try {
            Person person = personService.findByEmail(email);
            return ResponseEntity.ok(convertToResponse(person));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Új személy létrehozása.
     * POST /api/persons
     * Body: CreatePersonRequest
     */
    @PostMapping
    public ResponseEntity<Object> createPerson(@Valid @RequestBody CreatePersonRequest request) {
        try {
            Person person = new Person();
            person.setFullName(request.getFullName());
            person.setLastName(request.getLastName());
            person.setEmail(request.getEmail());
            person.setPhone(request.getPhone());
            person.setIsActive(true);

            Person savedPerson = personService.create(person);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(convertToResponse(savedPerson));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Személy frissítése.
     * PUT /api/persons/{id}
     * Body: UpdatePersonRequest
     */
    @PutMapping("/{id}")
    public ResponseEntity<Object> updatePerson(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePersonRequest request) {
        try {
            Person personDetails = new Person();
            personDetails.setFullName(request.getFullName());
            personDetails.setLastName(request.getLastName());
            personDetails.setEmail(request.getEmail());
            personDetails.setPhone(request.getPhone());
            personDetails.setIsActive(request.getIsActive());

            Person updatedPerson = personService.update(id, personDetails);

            return ResponseEntity.ok(convertToResponse(updatedPerson));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Személy deaktiválása (soft delete).
     * PATCH /api/persons/{id}/deactivate
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Object> deactivatePerson(@PathVariable Long id) {
        try {
            personService.deactivate(id);
            return ResponseEntity.ok(Map.of("message", "Person deactivated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Személy törlése (hard delete).
     * DELETE /api/persons/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletePerson(@PathVariable Long id) {
        try {
            personService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Person deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Person entitás konvertálása PersonResponse DTO-vá.
     */
    private PersonResponse convertToResponse(Person person) {
        return new PersonResponse(
                person.getId(),
                person.getFullName(),
                person.getLastName(),
                person.getEmail(),
                person.getPhone(),
                person.getIsActive(),
                person.getCreatedAt(),
                person.getUpdatedAt()
        );
    }
}
