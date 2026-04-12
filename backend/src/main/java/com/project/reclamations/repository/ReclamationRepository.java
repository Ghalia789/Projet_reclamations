package com.project.reclamations.repository;

import com.project.reclamations.entity.Reclamation;
import com.project.reclamations.enums.StatutReclamation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findByStatut(StatutReclamation statut);
    List<Reclamation> findByClientId(Long clientId);
}
