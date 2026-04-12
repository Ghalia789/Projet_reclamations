package com.project.reclamations.repository;

import com.project.reclamations.entity.SuiviReclamation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SuiviReclamationRepository extends JpaRepository<SuiviReclamation, Long> {
    List<SuiviReclamation> findByReclamationIdOrderByDateActionAsc(Long reclamationId);
}
