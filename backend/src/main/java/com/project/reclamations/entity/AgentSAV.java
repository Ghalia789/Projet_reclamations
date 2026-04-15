package com.project.reclamations.entity;

import com.project.reclamations.enums.NiveauAgent;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;
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
@Table(name = "agents_sav")
public class AgentSAV {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom de l'agent est obligatoire")
    @Column(nullable = false, length = 100)
    private String nom;

    @NotBlank(message = "La competence est obligatoire")
    @Column(nullable = false, length = 150)
    private String competence;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private NiveauAgent niveau;

    @Column(length = 100)
    private String equipe;

    @Column(nullable = false)
    private Boolean actif;

    @Builder.Default
    @OneToMany(mappedBy = "agentAssigne", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Reclamation> reclamationsAssignees = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "agentAuteur", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<SuiviReclamation> suivisCrees = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (actif == null) {
            actif = Boolean.TRUE;
        }
        if (niveau == null) {
            niveau = NiveauAgent.L1;
        }
    }
}
