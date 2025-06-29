/*
package com.biontecapi.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.biontecapi.dtos.RoleUserDto;
import com.biontecapi.repository.RoleRepo;
import com.biontecapi.model.Role;
import com.biontecapi.model.User;
import com.biontecapi.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class RoleUserService {

    @Autowired
    UserRepo userRepository;
    @Autowired
    RoleRepo rolesRepository;

    public User execute(RoleUserDto roleUserDTO) {

        Optional<User> userExists = userRepository.findById(roleUserDTO.getIdUser());
        List<Role> roles = new ArrayList<>();
            System.out.print("UsuarioDTO apresentado --->"+ userExists +"<---");
        if (!userExists.isPresent()) {
            throw new Error("Usuario não existe!");
        }
        roles = roleUserDTO.getIdsRoles()
                .stream()
                 .map(role -> {
                   return new Role(role);
                     })
                .collect(Collectors.toList());
        User user = userExists.get();
        user.setRoles(roles);
        userRepository.save(user);
        return user;

    }

    public List<Role> listRoles() {
       return rolesRepository.findAll();
    }

 */
/*   public RoleModel listRolesByName(String role_name) {
        return rolesRepository.findByName_role(role_name);
    }*//*

}*/
