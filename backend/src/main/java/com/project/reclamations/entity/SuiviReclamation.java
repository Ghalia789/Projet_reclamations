package com.project.reclamations.entity;

import com.project.reclamations.enums.ActionSuivi;
import com.project.reclamations.enums.StatutReclamation;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "suivi_reclamations")
public class SuiviReclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le message de suivi est obligatoire")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @NotNull(message = "L'action de suivi est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ActionSuivi action;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private StatutReclamation statutAvant;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private StatutReclamation statutApres;

    @Column(nullable = false)
    private LocalDateTime dateAction;

    @PositiveOrZero(message = "Le temps passe doit etre positif ou nul")
    @Column
    private Integer timeSpentMinutes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reclamation_id", nullable = false)
    private Reclamation reclamation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_auteur_id")
    private AgentSAV agentAuteur;

    @PrePersist
    public void prePersist() {
        if (dateAction == null) {
            dateAction = LocalDateTime.now();
        }
    }
}
