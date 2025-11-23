package com.founders404.backend.exception;

/**
 * Kivétel, ha nincs elegendő készlet.
 */
public class InsufficientStockException extends RuntimeException {

    private final Long productId;
    private final Integer requestedQuantity;
    private final Integer availableQuantity;

    public InsufficientStockException(Long productId, Integer requestedQuantity, Integer availableQuantity) {
        super(String.format(
                "Nincs elegendő készlet! Termék ID: %d, Kért mennyiség: %d, Elérhető: %d",
                productId, requestedQuantity, availableQuantity
        ));
        this.productId = productId;
        this.requestedQuantity = requestedQuantity;
        this.availableQuantity = availableQuantity;
    }

    public Long getProductId() {
        return productId;
    }

    public Integer getRequestedQuantity() {
        return requestedQuantity;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }
}
