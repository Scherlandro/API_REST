package com.biontecapi.dtos;

import java.util.List;
import java.util.UUID;

import lombok.Data;

@Data
public class RoleUserDto {

    private Long idUser;

    private List<Long> idsRoles;

}
