package com.project.reclamations.entity;

import com.project.reclamations.enums.CanalOrigineReclamation;
import com.project.reclamations.enums.PrioriteReclamation;
import com.project.reclamations.enums.RootCauseReclamation;
import com.project.reclamations.enums.StatutReclamation;
import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reclamations")
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La description de la reclamation est obligatoire")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, unique = true, length = 40)
    private String numeroTicket;

    @Column(nullable = false)
    private LocalDateTime dateCreation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatutReclamation statut;

    @Min(value = 1, message = "La note minimale est 1")
    @Max(value = 5, message = "La note maximale est 5")
    @Column
    private Integer note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PrioriteReclamation priorite;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CanalOrigineReclamation canalOrigine;

    @Column
    private LocalDateTime dateResolution;

    @Column
    private LocalDateTime slaDueAt;

    @Enumerated(EnumType.STRING)
    @Column(length = 40)
    private RootCauseReclamation rootCause;

    @Column(nullable = false)
    private Integer reopenCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produit_id", nullable = false)
    private Produit produit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_assigne_id")
    private AgentSAV agentAssigne;

    @Builder.Default
    @OneToMany(mappedBy = "reclamation", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<SuiviReclamation> suivis = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (dateCreation == null) {
            dateCreation = LocalDateTime.now();
        }
        if (statut == null) {
            statut = StatutReclamation.OUVERTE;
        }
        if (priorite == null) {
            priorite = PrioriteReclamation.MOYENNE;
        }
        if (canalOrigine == null) {
            canalOrigine = CanalOrigineReclamation.WEB;
        }
        if (numeroTicket == null || numeroTicket.isBlank()) {
            numeroTicket = "TCK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        if (reopenCount == null) {
            reopenCount = 0;
        }
    }
}
