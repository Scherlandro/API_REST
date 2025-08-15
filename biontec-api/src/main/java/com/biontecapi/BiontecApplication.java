package com.biontecapi;

//import org.apache.activemq.broker.BrokerService;
import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BiontecApplication {

	public static void main(String[] args) {
		SpringApplication.run(BiontecApplication.class, args);
	}

	@Bean
	public ModelMapper modelMapper(){
		return new ModelMapper();
	}



}
