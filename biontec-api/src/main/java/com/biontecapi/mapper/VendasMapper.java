package com.biontecapi.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.biontecapi.dtos.VendasDto;
import com.biontecapi.model.Vendas;

@Mapper(
        componentModel = "spring",
        uses = ItensDaVendaMapper.class,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface VendasMapper {

    @Mapping(target = "dtVenda", source = "dtVenda")
    VendasDto toDto(Vendas entity);

    @Mapping(target = "idVenda", ignore = true)
    @Mapping(target = "dtVenda", ignore = true) // setado no @PrePersist
    Vendas toEntity(VendasDto dto);
}
