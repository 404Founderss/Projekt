package com.founders404.backend.service;

import com.founders404.backend.model.Warehouse;
import com.founders404.backend.repository.ProductRepository;
import com.founders404.backend.repository.ShelfRepository;
import com.founders404.backend.repository.WarehouseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class WarehouseServiceSimpleTest {

    @Mock
    private WarehouseRepository warehouseRepository;

    @Mock
    private ShelfRepository shelfRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private WarehouseService warehouseService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void findById_success() {
        // Arrange
        Warehouse warehouse = new Warehouse();
        warehouse.setId(1L);
        warehouse.setName("Main Warehouse");

        when(warehouseRepository.findById(1L)).thenReturn(Optional.of(warehouse));

        // Act
        Warehouse result = warehouseService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Main Warehouse", result.getName());
    }
}
