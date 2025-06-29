package com.biontecapi.controller;


import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.biontecapi.dtos.UserDto;
import com.biontecapi.model.Role;
import com.biontecapi.model.User;
import com.biontecapi.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    @Autowired
    private ModelMapper mapper;

    @GetMapping(path = "/all")
    public ResponseEntity<List<User>> listarUsuarios(){
        return ResponseEntity.ok().body(userService.listUsers());
    }


    @GetMapping(path = "/getUser/{username}")
    public User consultar(@PathVariable("username") String username){
        return userService.getUser(username);
    }

/*
    @PostMapping(path = "/save-user")
    public ResponseEntity<User> criarUsuario(@RequestBody User user){
      URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/user/save-user").toUriString());
        return ResponseEntity.created(uri).body(userService.saveUser(user));
    }
*/

    @PostMapping(path = "/save-user/")
    public ResponseEntity salvar(@RequestBody UserDto userDto){
        userService.saveUser(mapper.map(userDto, User.class));
        Optional<User> profissionais = userService.findById(userDto.getId_user());
        return ResponseEntity.ok(profissionais.map(e->mapper.map(e,
                User.class)).map(record -> ResponseEntity.ok().body(record))
                .orElse(ResponseEntity.notFound().build()));
    }

    @PutMapping(path = "/edit-user")
    public User editar(@RequestBody User user){
        return userService.saveUser(user);
    }

    @DeleteMapping(path = "/delete-user/{id}")
    public void excluir(@PathVariable("id") Long id){
        userService.removeUser(id);
    }

    @PostMapping(path = "/save-role")
    public ResponseEntity<Role> criarCargo(@RequestBody Role role){
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/user/save-role").toUriString());
        return ResponseEntity.created(uri).body(userService.saveRole(role));
    }

    @PostMapping(path = "/role-addtouser")
    public ResponseEntity<?> adicionarCargo(@RequestBody RoleToUserForm form){
        userService.addRoleToUser(form.getUsername(), form.getRoleName());
        return ResponseEntity.ok().build();
    }
/*
  Não atualiza mesmo com PutMapping
    @PutMapping(path = "/edit-roletouser/{username},{rolename}")
    public ResponseEntity<User> editarCargo(@PathVariable("username") final String username,
                                            @PathVariable("rolename") final String rolename){
        log.info("Editando role {} para usuario {}", rolename, username);
        userService.addRoleToUser(username, rolename);
        return ResponseEntity.ok().build();
    }*/

    @GetMapping(path = "/token-refresh")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String authorizationHeader = request.getHeader(AUTHORIZATION);
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")){
            try {
                String refresh_token = authorizationHeader.substring("Bearer".length());
                Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
                JWTVerifier verifier = JWT.require(algorithm).build();
                DecodedJWT decodedJWT = verifier.verify(refresh_token);
                String username = decodedJWT.getSubject();
                User user = userService.getUser(username);
                String access_token = JWT.create()
                        .withSubject(user.getUsername())
                        .withExpiresAt(new Date(System.currentTimeMillis()+ 30 * 60 * 1000))
                        .withIssuer(request.getRequestURI().toString())
                        .withClaim("roles", user.getRoles().stream().map(Role::getName).collect(Collectors.toList()))
                        .sign(algorithm);
                Map<String,String> tokens = new HashMap<>();
                tokens.put("access_token", access_token);
                tokens.put("refresh_token", refresh_token);
                response.setContentType(APPLICATION_JSON_VALUE);
                new ObjectMapper().writeValue(response.getOutputStream(), tokens);
             }catch (Exception exception){
                response.setHeader("error in UserController ",exception.getMessage());
                response.setStatus(FORBIDDEN.value());
                //response.sendError(FORBIDDEN.value());
                Map<String,String> error = new HashMap<>();
                error.put("error_message", exception.getMessage());
                response.setContentType(APPLICATION_JSON_VALUE);
                new ObjectMapper().writeValue(response.getOutputStream(), error);
            }
        }else {
            throw new RuntimeException("Refresh token is missing");
        }
    }
}

@Data
class RoleToUserForm{
    private String username;
    private String roleName;
}