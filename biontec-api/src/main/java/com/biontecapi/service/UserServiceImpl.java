package com.biontecapi.service;

import com.biontecapi.config.PasswordEnconderConfig;
import com.biontecapi.model.Role;
import com.biontecapi.model.User;
import com.biontecapi.repository.RoleRepo;
import com.biontecapi.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service @RequiredArgsConstructor @Transactional @Slf4j
public class UserServiceImpl implements UserService, UserDetailsService {
    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final PasswordEnconderConfig passwordEnconderConfig;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username);
        if (user == null){
            log.error("User {} not found in the database", username);
            throw new UsernameNotFoundException("User {} not found in the database" + username);
        }else {
            log.info("User found in the database: {}", username);
        }
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        user.getRoles().forEach( role -> {
              authorities.add(new SimpleGrantedAuthority(role.getName()));
                });
        log.info("The authorization role : {}", authorities);
            return new org.springframework.security.core.userdetails.User(user.getUsername(),user.getPassword(), authorities);
    }


    @Override
    public User saveUser(User user) {
        log.info("User {} salve to the database", user.getName());
       user.setPassword(passwordEnconderConfig.PasswordEnconderConfig().encode(user.getPassword()));
        return userRepo.save(user);
    }

    @Override
    public Role saveRole(Role role) {
        log.info("Role {} salve to the database", role.getName());
        return roleRepo.save(role);
    }

    @Override
    public void addRoleToUser(String username, String rolename) {
        User user = userRepo.findByUsername(username);
        Role role = roleRepo.findByName(rolename);
        log.info("Adding role {} to user {}", rolename, username);
        user.getRoles().add(role);
    }

    @Override
    public User getUser(String username) {
        log.info("Fetching user {}", username);
        return userRepo.findByUsername(username);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepo.findById(id);
    }

    @Override
    public List<User> listUsers() {
      //  log.info("Fetching all users");
        return userRepo.findAll();
    }

    @Override
    public void removeUser(Long id) {
        log.info("Removing id do User {}", id);
         userRepo.deleteById(id);
    }


}
