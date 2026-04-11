package com.project.reclamations.enums;

/**
 * Enum representing the action types in the audit trail (SuiviReclamation)
 */
public enum ActionSuivi {
    /**
     * Complaint was created
     */
    CREATED("Created", "Complaint was created"),

    /**
     * Agent was assigned to the complaint
     */
    ASSIGNED("Assigned", "Agent was assigned to complaint"),

    /**
     * Complaint was updated
     */
    UPDATED("Updated", "Complaint was updated"),

    /**
     * Complaint was resolved
     */
    RESOLVED("Resolved", "Complaint was resolved"),

    /**
     * Complaint was closed
     */
    CLOSED("Closed", "Complaint was closed");

    private final String displayName;
    private final String description;

    ActionSuivi(String displayName, String description) {
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
