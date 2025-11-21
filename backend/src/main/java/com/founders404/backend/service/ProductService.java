package com.founders404.backend.service;

import com.founders404.backend.model.Product;
import com.founders404.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * A Product entitás üzleti logikája.
 */
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    /**
     * Összes termék lekérése.
     */
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    /**
     * Termék lekérése ID alapján.
     * @throws RuntimeException ha nem található
     */
    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    /**
     * Termék keresése SKU alapján.
     * @throws RuntimeException ha nem található
     */
    public Product findBySku(String sku) {
        return productRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Product not found with SKU: " + sku));
    }

    /**
     * Termék keresése vonalkód alapján.
     * @throws RuntimeException ha nem található
     */
    public Product findByBarcode(String barcode) {
        return productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new RuntimeException("Product not found with barcode: " + barcode));
    }

    /**
     * Termék keresése QR kód alapján.
     * @throws RuntimeException ha nem található
     */
    public Product findByQrCode(String qrCode) {
        return productRepository.findByQrCode(qrCode)
                .orElseThrow(() -> new RuntimeException("Product not found with QR code: " + qrCode));
    }

    /**
     * Cég összes terméke.
     */
    public List<Product> findByCompanyId(Long companyId) {
        return productRepository.findByCompanyId(companyId);
    }

    /**
     * Cég aktív termékei.
     */
    public List<Product> findActiveByCompanyId(Long companyId) {
        return productRepository.findByCompanyIdAndIsActiveTrue(companyId);
    }

    /**
     * Termékek keresése név alapján.
     */
    public List<Product> searchByName(Long companyId, String name) {
        return productRepository.findByCompanyIdAndNameContainingIgnoreCase(companyId, name);
    }

    /**
     * Aktív termékek keresése név alapján.
     */
    public List<Product> searchActiveByName(Long companyId, String name) {
        return productRepository.findByCompanyIdAndIsActiveTrueAndNameContainingIgnoreCase(companyId, name);
    }

    /**
     * Kategória szerint szűrés.
     */
    public List<Product> findByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    /**
     * Beszállító szerint szűrés.
     */
    public List<Product> findBySupplierId(Long supplierId) {
        return productRepository.findBySupplierId(supplierId);
    }

    /**
     * Újrarendelésre váró termékek.
     */
    public List<Product> findProductsNeedingReorder(Long companyId) {
        return productRepository.findByCompanyIdAndReorderPointIsNotNull(companyId);
    }

    /**
     * Új termék létrehozása.
     * @throws RuntimeException ha SKU vagy vonalkód már létezik
     */
    @Transactional
    public Product create(Product product) {
        // SKU duplikáció ellenőrzés
        if (product.getSku() != null && productRepository.existsBySku(product.getSku())) {
            throw new RuntimeException("Product with SKU already exists: " + product.getSku());
        }

        // Vonalkód duplikáció ellenőrzés
        if (product.getBarcode() != null && productRepository.existsByBarcode(product.getBarcode())) {
            throw new RuntimeException("Product with barcode already exists: " + product.getBarcode());
        }

        return productRepository.save(product);
    }

    /**
     * Termék frissítése.
     * @throws RuntimeException ha nem található vagy SKU/vonalkód már létezik
     */
    @Transactional
    public Product update(Long id, Product productDetails) {
        Product product = findById(id);

        // SKU ellenőrzés (ha változik és már létezik)
        if (productDetails.getSku() != null
                && !productDetails.getSku().equals(product.getSku())
                && productRepository.existsBySku(productDetails.getSku())) {
            throw new RuntimeException("Product with SKU already exists: " + productDetails.getSku());
        }

        // Vonalkód ellenőrzés (ha változik és már létezik)
        if (productDetails.getBarcode() != null
                && !productDetails.getBarcode().equals(product.getBarcode())
                && productRepository.existsByBarcode(productDetails.getBarcode())) {
            throw new RuntimeException("Product with barcode already exists: " + productDetails.getBarcode());
        }

        // Mezők frissítése (csak nem null értékek)
        if (productDetails.getName() != null) {
            product.setName(productDetails.getName());
        }
        if (productDetails.getSku() != null) {
            product.setSku(productDetails.getSku());
        }
        if (productDetails.getBarcode() != null) {
            product.setBarcode(productDetails.getBarcode());
        }
        if (productDetails.getQrCode() != null) {
            product.setQrCode(productDetails.getQrCode());
        }
        if (productDetails.getDescription() != null) {
            product.setDescription(productDetails.getDescription());
        }
        if (productDetails.getUnit() != null) {
            product.setUnit(productDetails.getUnit());
        }
        if (productDetails.getCategoryId() != null) {
            product.setCategoryId(productDetails.getCategoryId());
        }
        if (productDetails.getSupplierId() != null) {
            product.setSupplierId(productDetails.getSupplierId());
        }
        if (productDetails.getNetPurchasePrice() != null) {
            product.setNetPurchasePrice(productDetails.getNetPurchasePrice());
        }
        if (productDetails.getGrossPurchasePrice() != null) {
            product.setGrossPurchasePrice(productDetails.getGrossPurchasePrice());
        }
        if (productDetails.getNetSellingPrice() != null) {
            product.setNetSellingPrice(productDetails.getNetSellingPrice());
        }
        if (productDetails.getGrossSellingPrice() != null) {
            product.setGrossSellingPrice(productDetails.getGrossSellingPrice());
        }
        if (productDetails.getVatRate() != null) {
            product.setVatRate(productDetails.getVatRate());
        }
        if (productDetails.getCurrency() != null) {
            product.setCurrency(productDetails.getCurrency());
        }
        if (productDetails.getMinStockLevel() != null) {
            product.setMinStockLevel(productDetails.getMinStockLevel());
        }
        if (productDetails.getOptimalStockLevel() != null) {
            product.setOptimalStockLevel(productDetails.getOptimalStockLevel());
        }
        if (productDetails.getMaxStockLevel() != null) {
            product.setMaxStockLevel(productDetails.getMaxStockLevel());
        }
        if (productDetails.getReorderPoint() != null) {
            product.setReorderPoint(productDetails.getReorderPoint());
        }
        if (productDetails.getReorderQuantity() != null) {
            product.setReorderQuantity(productDetails.getReorderQuantity());
        }
        if (productDetails.getWeight() != null) {
            product.setWeight(productDetails.getWeight());
        }
        if (productDetails.getWidth() != null) {
            product.setWidth(productDetails.getWidth());
        }
        if (productDetails.getHeight() != null) {
            product.setHeight(productDetails.getHeight());
        }
        if (productDetails.getDepth() != null) {
            product.setDepth(productDetails.getDepth());
        }
        if (productDetails.getShelfLifeDays() != null) {
            product.setShelfLifeDays(productDetails.getShelfLifeDays());
        }
        if (productDetails.getIsActive() != null) {
            product.setIsActive(productDetails.getIsActive());
        }
        if (productDetails.getIsSerialized() != null) {
            product.setIsSerialized(productDetails.getIsSerialized());
        }
        if (productDetails.getNotes() != null) {
            product.setNotes(productDetails.getNotes());
        }
        if (productDetails.getImageUrl() != null) {
            product.setImageUrl(productDetails.getImageUrl());
        }

        return productRepository.save(product);
    }

    /**
     * Termék deaktiválása (soft delete).
     */
    @Transactional
    public void deactivate(Long id) {
        Product product = findById(id);
        product.setIsActive(false);
        productRepository.save(product);
    }

    /**
     * Termék végleges törlése.
     */
    @Transactional
    public void delete(Long id) {
        Product product = findById(id);
        productRepository.delete(product);
    }
}
