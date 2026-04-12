package com.project.reclamations.service;

import com.project.reclamations.dto.request.ProduitRequestDTO;
import com.project.reclamations.dto.response.ProduitResponseDTO;
import com.project.reclamations.entity.Produit;
import com.project.reclamations.exception.ResourceNotFoundException;
import com.project.reclamations.mapper.ProduitMapper;
import com.project.reclamations.repository.ProduitRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProduitService {

    private final ProduitRepository produitRepository;
    private final ProduitMapper produitMapper;

    @Transactional(readOnly = true)
    public List<ProduitResponseDTO> getAllProduits() {
        return produitRepository.findAll()
                .stream()
                .map(produitMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProduitResponseDTO getProduitById(Long id) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable avec l'id : " + id));
        return produitMapper.toResponseDTO(produit);
    }

    public ProduitResponseDTO createProduit(ProduitRequestDTO requestDTO) {
        Produit produit = produitMapper.toEntity(requestDTO);
        return produitMapper.toResponseDTO(produitRepository.save(produit));
    }

    public ProduitResponseDTO updateProduit(Long id, ProduitRequestDTO requestDTO) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable avec l'id : " + id));

        produit.setNom(requestDTO.getNom());
        produit.setCategorie(requestDTO.getCategorie());

        return produitMapper.toResponseDTO(produitRepository.save(produit));
    }

    public void deleteProduit(Long id) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable avec l'id : " + id));
        produitRepository.delete(produit);
    }
}
