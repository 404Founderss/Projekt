package com.founders404.backend.repository;

import com.founders404.backend.model.InventoryMovement;
import com.founders404.backend.model.MovementType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Készletmozgások repository.
 */
@Repository
public interface InventoryRepository extends JpaRepository<InventoryMovement, Long> {

    //mozgás idő szerint
    List<InventoryMovement> findByProductIdOrderByTimestampDesc(Long productId);

    //mozgás tipus szerint
    List<InventoryMovement> findByMovementType(MovementType movementType);

    //mozgás időintervallum szerint
    List<InventoryMovement> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

    List<InventoryMovement> findTop50ByOrderByTimestampDesc();

    //mozgás user szerint
    List<InventoryMovement> findByUserIdOrderByTimestampDesc(Long userId);

    //mozgás cég szerint
    List<InventoryMovement> findByProduct_CompanyIdOrderByTimestampDesc(Long companyId);
}
