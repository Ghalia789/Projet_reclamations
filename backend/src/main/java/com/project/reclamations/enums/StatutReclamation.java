package com.project.reclamations.enums;

/**
 * Enum representing the complaint status lifecycle
 */
public enum StatutReclamation {
    /**
     * Complaint just opened, not yet assigned
     */
    OUVERTE("Ouverte", "Complaint is open and awaiting assignment"),

    /**
     * Complaint is assigned to an agent and being processed
     */
    EN_COURS("En cours", "Complaint is being processed"),

    /**
     * Complaint has been resolved
     */
    RESOLUE("Résolue", "Complaint has been resolved"),

    /**
     * Complaint is closed, no further action needed
     */
    FERMEE("Fermée", "Complaint is closed");

    private final String displayName;
    private final String description;

    StatutReclamation(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}
