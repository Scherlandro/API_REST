package com.biontecapi.mapper;

import com.biontecapi.dtos.PixResponseDTO;
import com.biontecapi.model.Pagamentos;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface PagamentosMapper {

    void updateEntityWithPix(Pagamentos pagamento, PixResponseDTO pixDto);

}


