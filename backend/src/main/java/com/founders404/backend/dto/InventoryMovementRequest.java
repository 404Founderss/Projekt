package com.founders404.backend.dto;

import com.founders404.backend.model.MovementType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryMovementRequest {

    @NotNull(message = "Termék ID kötelező")
    private Long productId;

    @NotNull(message = "Mozgás típus kötelező")
    private MovementType movementType;

    @NotNull(message = "Mennyiség kötelező")
    @Min(value = 1, message = "Mennyiség legalább 1 kell legyen")
    private Integer quantity;

    private String reason;

    private String notes;
}
