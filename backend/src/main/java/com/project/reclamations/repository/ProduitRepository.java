package com.project.reclamations.repository;

import com.project.reclamations.entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProduitRepository extends JpaRepository<Produit, Long> {
}
