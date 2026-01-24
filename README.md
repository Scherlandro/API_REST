Updating the project structure with the addition of MapStruct and the creation of the mapper module:
Old version:
com.biontecapi
 ├── controller
 ├── service
 ├── model
 ├── dtos
 └── repository
 New version
 ├── mapper
 │    ├── VendasMapper.java
 │    └── ItensDaVendaMapper.java
 │    ├── ClientesMapper.java
 │    └── FuncionariosMapper.java
 │    └── ... Mapper.java
 ├── controller
 ├── service
 ├── model
 ├── dtos
 └── repository
