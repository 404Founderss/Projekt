package com.founders404.backend.service;

import com.founders404.backend.model.Company;
import com.founders404.backend.repository.CompanyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CompanyServiceSimpleTest {

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private CompanyService companyService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void findById_success() {
        // Arrange
        Company company = new Company();
        company.setId(1L);
        company.setName("Test Company");

        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));

        // Act
        Company result = companyService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Company", result.getName());
    }
}
