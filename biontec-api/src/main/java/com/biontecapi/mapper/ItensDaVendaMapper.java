package com.biontecapi.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.biontecapi.dtos.ItensDaVendaDto;
import com.biontecapi.model.ItensDaVenda;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface ItensDaVendaMapper {

    ItensDaVendaDto toDto(ItensDaVenda entity);

    ItensDaVenda toEntity(ItensDaVendaDto dto);
}
