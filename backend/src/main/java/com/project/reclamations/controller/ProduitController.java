package com.project.reclamations.controller;

import com.project.reclamations.dto.request.ProduitRequestDTO;
import com.project.reclamations.dto.response.ProduitResponseDTO;
import com.project.reclamations.exception.ApiErrorResponse;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import com.project.reclamations.service.ProduitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/produits")
@RequiredArgsConstructor
@Tag(name = "Produits", description = "Gestion des produits")
public class ProduitController {

    private final ProduitService produitService;

    @GetMapping
    @Operation(summary = "Lister tous les produits")
        @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des produits",
                content = @Content(array = @ArraySchema(schema = @Schema(implementation = ProduitResponseDTO.class)))),
            @ApiResponse(responseCode = "500", description = "Erreur interne",
                content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
    public ResponseEntity<List<ProduitResponseDTO>> getAllProduits() {
        return ResponseEntity.ok(produitService.getAllProduits());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Recuperer un produit par son identifiant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Produit trouve",
                    content = @Content(schema = @Schema(implementation = ProduitResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Produit introuvable",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<ProduitResponseDTO> getProduitById(@PathVariable Long id) {
        return ResponseEntity.ok(produitService.getProduitById(id));
    }

    @PostMapping
    @Operation(summary = "Creer un nouveau produit")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Produit cree",
                    content = @Content(schema = @Schema(implementation = ProduitResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Donnees invalides",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<ProduitResponseDTO> createProduit(@Valid @RequestBody ProduitRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produitService.createProduit(requestDTO));
    }
}
