package com.project.reclamations.controller;

import com.project.reclamations.dto.request.AdminAccountCreateRequestDTO;
import com.project.reclamations.dto.request.AdminAccountUpdateRequestDTO;
import com.project.reclamations.dto.request.AdminPasswordResetRequestDTO;
import com.project.reclamations.dto.response.AdminAccountResponseDTO;
import com.project.reclamations.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/agents/accounts")
@Tag(name = "Admin - Comptes Agents", description = "Gestion des comptes agents")
public class AdminAccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping
    @Operation(summary = "Creer un compte agent")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Compte cree",
                    content = @Content(schema = @Schema(implementation = AdminAccountResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Donnees invalides")
    })
    public ResponseEntity<AdminAccountResponseDTO> createAccount(@Valid @RequestBody AdminAccountCreateRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(accountService.createAccount(requestDTO));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre a jour un compte agent")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Compte mis a jour",
                    content = @Content(schema = @Schema(implementation = AdminAccountResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Compte introuvable")
    })
    public ResponseEntity<AdminAccountResponseDTO> updateAccount(
            @PathVariable Long id,
            @Valid @RequestBody AdminAccountUpdateRequestDTO requestDTO
    ) {
        return ResponseEntity.ok(accountService.updateAccount(id, requestDTO));
    }

    @PutMapping("/{id}/reset-password")
    @Operation(summary = "Reinitialiser le mot de passe d'un compte agent")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Mot de passe reinitialise"),
            @ApiResponse(responseCode = "404", description = "Compte introuvable")
    })
    public ResponseEntity<Void> resetPassword(
            @PathVariable Long id,
            @Valid @RequestBody AdminPasswordResetRequestDTO requestDTO
    ) {
        accountService.resetPassword(id, requestDTO);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(summary = "Lister tous les comptes agents")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des comptes",
                    content = @Content(schema = @Schema(implementation = AdminAccountResponseDTO.class)))
    })
    public ResponseEntity<List<AdminAccountResponseDTO>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Recuperer un compte agent par son id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Compte trouve",
                    content = @Content(schema = @Schema(implementation = AdminAccountResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Compte introuvable")
    })
    public ResponseEntity<AdminAccountResponseDTO> getAccount(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getAccount(id));
    }
}
