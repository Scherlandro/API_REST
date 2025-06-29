package com.biontecapi.service;

import com.biontecapi.model.Role;
import com.biontecapi.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User saveUser(User user);
    Role saveRole(Role role);
    void addRoleToUser(String username, String rolename);
    User getUser(String username);
    Optional<User> findById(Long id) ;
    List<User> listUsers();
    void removeUser(Long id);
}
