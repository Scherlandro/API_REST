package com.biontecapi.mapper;


import com.biontecapi.dtos.OrdemDeServicoDTO;
import com.biontecapi.model.OrdemDeServico;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;


@Mapper(
            componentModel = "spring",
            uses = ItensDoServicoMapper.class,
            unmappedTargetPolicy = ReportingPolicy.IGNORE
    )
    public interface OrdemDeServicoMapper {

        @Mapping(target = "dataDeEntrada", source = "dataDeEntrada")
        OrdemDeServicoDTO toDto(OrdemDeServico entity);

        @Mapping(target = "idOS", ignore = true)
        @Mapping(target = "dataDeEntrada", ignore = true)
        OrdemDeServico toEntity(OrdemDeServicoDTO dto);
    }
