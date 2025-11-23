package com.founders404.backend.dto;

import com.founders404.backend.model.InventoryMovement;
import com.founders404.backend.model.MovementType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Készletmozgás válasz.
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryMovementDTO {

    private Long id;

    // Termék info
    private Long productId;
    private String productName;
    private String productSku;

    // User info
    private Long userId;
    private String username;

    // Mozgás adatok
    private MovementType movementType;
    private Integer quantity;
    private String reason;
    private String notes;

    // Készlet állapot
    private Integer previousStock;
    private Integer newStock;

    // Időbélyeg
    private LocalDateTime timestamp;
    private LocalDateTime createdAt;

    /**
     * Factory metódus entity-ből DTO létrehozásához.
     */
    public static InventoryMovementDTO fromEntity(InventoryMovement entity) {
        InventoryMovementDTO dto = new InventoryMovementDTO();
        dto.setId(entity.getId());
        dto.setProductId(entity.getProduct().getId());
        dto.setProductName(entity.getProduct().getName());
        dto.setProductSku(entity.getProduct().getSku());
        dto.setUserId(entity.getUser().getId());
        dto.setUsername(entity.getUser().getUsername());
        dto.setMovementType(entity.getMovementType());
        dto.setQuantity(entity.getQuantity());
        dto.setReason(entity.getReason());
        dto.setNotes(entity.getNotes());
        dto.setPreviousStock(entity.getPreviousStock());
        dto.setNewStock(entity.getNewStock());
        dto.setTimestamp(entity.getTimestamp());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
