package com.biontecapi.mapper;
import com.biontecapi.dtos.ItensDoServicoDTO;
import com.biontecapi.model.ItensDoServico;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(
            componentModel = "spring",
            unmappedTargetPolicy = ReportingPolicy.IGNORE
    )
    public interface ItensDoServicoMapper {

        ItensDoServicoDTO toDto(ItensDoServico entity);

        List<ItensDoServicoDTO> toDto(List<ItensDoServico> entities);
    }

