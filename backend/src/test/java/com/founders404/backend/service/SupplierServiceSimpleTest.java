package com.founders404.backend.service;

import com.founders404.backend.model.Supplier;
import com.founders404.backend.repository.SupplierRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SupplierServiceSimpleTest {

    @Mock
    private SupplierRepository supplierRepository;

    @InjectMocks
    private SupplierService supplierService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void findById_success() {
        // Arrange
        Supplier supplier = new Supplier();
        supplier.setId(1L);
        supplier.setName("Test Supplier");

        when(supplierRepository.findById(1L)).thenReturn(Optional.of(supplier));

        // Act
        Supplier result = supplierService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Supplier", result.getName());
    }
}
