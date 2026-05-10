package com.project.reclamations.service;

import com.project.reclamations.entity.AgentSAV;
import com.project.reclamations.entity.UserAccount;
import com.project.reclamations.exception.ResourceNotFoundException;
import com.project.reclamations.repository.AgentSAVRepository;
import com.project.reclamations.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private AgentSAVRepository agentSAVRepository;

    public UserAccount getCurrentUserAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("Utilisateur non authentifie");
        }

        Object principal = authentication.getPrincipal();
        String email;
        if (principal instanceof UserDetails details) {
            email = details.getUsername();
        } else {
            email = principal.toString();
        }

        return userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Compte utilisateur introuvable"));
    }

    public AgentSAV getCurrentAgent() {
        UserAccount account = getCurrentUserAccount();
        return agentSAVRepository.findByUserAccountId(account.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Agent introuvable pour ce compte"));
    }
}
