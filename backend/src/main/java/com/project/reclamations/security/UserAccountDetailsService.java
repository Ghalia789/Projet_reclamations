package com.project.reclamations.security;

import com.project.reclamations.entity.UserAccount;
import com.project.reclamations.repository.UserAccountRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserAccountDetailsService implements UserDetailsService {

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.security.username}")
    private String demoUsername;

    @Value("${app.security.password}")
    private String demoPassword;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserAccount> account = userAccountRepository.findByEmail(username);
        if (account.isPresent()) {
            return new UserAccountDetails(account.get());
        }

        if (demoUsername != null && demoUsername.equals(username)) {
            return User.withUsername(demoUsername)
                    .password(passwordEncoder.encode(demoPassword))
                    .roles("ADMIN")
                    .build();
        }

        throw new UsernameNotFoundException("Utilisateur introuvable : " + username);
    }
}
