package com.project.reclamations.controller;

import com.project.reclamations.dto.request.AssignAgentRequestDTO;
import com.project.reclamations.dto.request.ReclamationRequestDTO;
import com.project.reclamations.dto.request.SuiviReclamationRequestDTO;
import com.project.reclamations.dto.request.UpdateStatutRequestDTO;
import com.project.reclamations.dto.response.ReclamationResponseDTO;
import com.project.reclamations.dto.response.SuiviReclamationResponseDTO;
import com.project.reclamations.exception.ApiErrorResponse;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import com.project.reclamations.service.ReclamationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reclamations")
@Tag(name = "Reclamations", description = "Gestion des reclamations")
public class ReclamationController {

    @Autowired
    private ReclamationService reclamationService;

    @GetMapping
    @Operation(summary = "Lister toutes les reclamations")
        @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des reclamations",
                content = @Content(array = @ArraySchema(schema = @Schema(implementation = ReclamationResponseDTO.class)))),
            @ApiResponse(responseCode = "500", description = "Erreur interne",
                content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
    public ResponseEntity<List<ReclamationResponseDTO>> getAllReclamations() {
        return ResponseEntity.ok(reclamationService.getAllReclamations());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Recuperer une reclamation par son identifiant")
        @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reclamation trouvee",
                content = @Content(schema = @Schema(implementation = ReclamationResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Reclamation introuvable",
                content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
    public ResponseEntity<ReclamationResponseDTO> getReclamationById(@PathVariable Long id) {
        return ResponseEntity.ok(reclamationService.getReclamationById(id));
    }

    @PostMapping
    @Operation(summary = "Creer une reclamation")
        @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Reclamation creee",
                content = @Content(schema = @Schema(implementation = ReclamationResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Donnees invalides",
                content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
    public ResponseEntity<ReclamationResponseDTO> createReclamation(@Valid @RequestBody ReclamationRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reclamationService.createReclamation(requestDTO));
    }

    @PutMapping("/{id}/assign")
    @Operation(summary = "Assigner un agent a une reclamation")
        @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Agent assigne",
                content = @Content(schema = @Schema(implementation = ReclamationResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requete invalide",
                content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Ressource introuvable",
                content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
    public ResponseEntity<ReclamationResponseDTO> assignAgent(
            @PathVariable Long id,
            @Valid @RequestBody AssignAgentRequestDTO requestDTO
    ) {
        return ResponseEntity.ok(reclamationService.assignAgent(id, requestDTO.getAgentId()));
    }

    @PutMapping("/{id}/statut")
    @Operation(summary = "Mettre a jour le statut d'une reclamation")
        @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Statut mis a jour",
                content = @Content(schema = @Schema(implementation = ReclamationResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requete invalide",
                content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Reclamation introuvable",
                content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
    public ResponseEntity<ReclamationResponseDTO> updateStatut(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatutRequestDTO requestDTO
    ) {
        return ResponseEntity.ok(reclamationService.updateStatut(id, requestDTO.getStatut(), requestDTO.getMessage(), requestDTO.getTimeSpentMinutes()));
    }

    @GetMapping("/{id}/suivi")
    @Operation(summary = "Recuperer le suivi d'une reclamation")
        @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Historique de suivi",
                content = @Content(array = @ArraySchema(schema = @Schema(implementation = SuiviReclamationResponseDTO.class)))),
            @ApiResponse(responseCode = "404", description = "Reclamation introuvable",
                content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
    public ResponseEntity<List<SuiviReclamationResponseDTO>> getSuivisByReclamation(@PathVariable Long id) {
        return ResponseEntity.ok(reclamationService.getSuivisByReclamation(id));
    }

    @PostMapping("/{id}/suivi")
    @Operation(summary = "Ajouter une entree de suivi a une reclamation")
        @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Suivi ajoute",
                content = @Content(schema = @Schema(implementation = SuiviReclamationResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requete invalide",
                content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Ressource introuvable",
                content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
    public ResponseEntity<SuiviReclamationResponseDTO> addSuivi(
            @PathVariable Long id,
            @Valid @RequestBody SuiviReclamationRequestDTO requestDTO
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reclamationService.addSuivi(id, requestDTO));
    }

    @GetMapping("/rapport")
    @Operation(summary = "Generer le rapport de satisfaction")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rapport genere"),
            @ApiResponse(responseCode = "500", description = "Erreur interne",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<Map<String, Object>> getRapport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return ResponseEntity.ok(reclamationService.getRapportSatisfaction(fromDate, toDate));
    }

    @GetMapping("/rapport/download")
    @Operation(summary = "Telecharger le rapport de satisfaction")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rapport telecharge"),
            @ApiResponse(responseCode = "400", description = "Format non supporte",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<byte[]> downloadRapport(
            @RequestParam(defaultValue = "csv") String format,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        String normalizedFormat = format.toLowerCase();
        byte[] fileContent;
        String filename;
        String contentType;

        switch (normalizedFormat) {
            case "csv" -> {
                fileContent = reclamationService.generateRapportCsv(fromDate, toDate);
                filename = reclamationService.buildRapportFilename("csv");
                contentType = "text/csv";
            }
            case "json" -> {
                fileContent = reclamationService.generateRapportJson(fromDate, toDate);
                filename = reclamationService.buildRapportFilename("json");
                contentType = MediaType.APPLICATION_JSON_VALUE;
            }
            case "pdf" -> {
                fileContent = reclamationService.generateRapportPdf(fromDate, toDate);
                filename = reclamationService.buildRapportFilename("pdf");
                contentType = MediaType.APPLICATION_PDF_VALUE;
            }
            default -> {
                return ResponseEntity.badRequest().build();
            }
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(fileContent);
    }
}
