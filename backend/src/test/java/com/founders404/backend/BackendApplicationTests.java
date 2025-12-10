package com.founders404.backend;

import com.founders404.backend.model.*;
import com.founders404.backend.repository.*;
import com.founders404.backend.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Backend alkalmazás teljes teszt suite.
 * Minden teszt külön metódusban jelenik meg.
 */
class BackendApplicationTests {

    // Mock repository-k
    @Mock private CategoryRepository categoryRepository;
    @Mock private CompanyRepository companyRepository;
    @Mock private WarehouseRepository warehouseRepository;
    @Mock private ShelfRepository shelfRepository;
    @Mock private ProductRepository productRepository;
    @Mock private SupplierRepository supplierRepository;
    @Mock private PersonRepository personRepository;

    // Service-ek
    private CategoryService categoryService;
    private CompanyService companyService;
    private WarehouseService warehouseService;
    private SupplierService supplierService;
    private PersonService personService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        categoryService = new CategoryService(categoryRepository);
        companyService = new CompanyService(companyRepository);
        warehouseService = new WarehouseService(warehouseRepository, shelfRepository, productRepository);
        supplierService = new SupplierService(supplierRepository);
        personService = new PersonService(personRepository);
    }

    @Test
    void test1_CategoryService_findById() {
        // Arrange
        Category category = new Category();
        category.setId(1L);
        category.setName("Electronics");
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        // Act
        Category result = categoryService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Electronics", result.getName());
    }

    @Test
    void test2_CategoryService_findAll() {
        // Arrange
        Category cat1 = new Category();
        cat1.setId(1L);
        cat1.setName("Electronics");

        Category cat2 = new Category();
        cat2.setId(2L);
        cat2.setName("Clothing");

        when(categoryRepository.findAll()).thenReturn(List.of(cat1, cat2));

        // Act
        List<Category> result = categoryService.findAll();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Electronics", result.get(0).getName());
        assertEquals("Clothing", result.get(1).getName());
    }

    @Test
    void test3_CompanyService_findById() {
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

    @Test
    void test4_WarehouseService_findById() {
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

    @Test
    void test5_SupplierService_findById() {
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

    @Test
    void test6_PersonService_findById() {
        // Arrange
        Person person = new Person();
        person.setId(1L);
        person.setFullName("John Doe");
        when(personRepository.findById(1L)).thenReturn(Optional.of(person));

        // Act
        Person result = personService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("John Doe", result.getFullName());
    }

    @Test
    void test7_PersonService_findAll() {
        // Arrange
        Person p1 = new Person();
        p1.setId(1L);
        p1.setFullName("John Doe");

        Person p2 = new Person();
        p2.setId(2L);
        p2.setFullName("Jane Smith");

        when(personRepository.findAll()).thenReturn(List.of(p1, p2));

        // Act
        List<Person> result = personService.findAll();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("John Doe", result.get(0).getFullName());
        assertEquals("Jane Smith", result.get(1).getFullName());
    }
}
