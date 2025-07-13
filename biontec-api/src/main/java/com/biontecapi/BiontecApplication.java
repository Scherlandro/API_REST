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

/*	@Bean
	public BrokerService broker() throws Exception {
		BrokerService broker = new BrokerService();
		broker.addConnector("tcp://localhost:61616");
		broker.setPersistent(false);
		return broker;
	}*/

/*	public static void main(String[] args) {
     new SpringApplicationBuilder(BiontecApplication.class)
                .web(WebApplicationType.NONE).run(args);
	}*/


/*
	@Bean
	CommandLineRunner run(UserService userService){
		return args -> {
			userService.saveRole(new Role(null,"ROLE_USER"));
			userService.saveRole(new Role(null,"ROLE_MANAGER"));
			userService.saveRole(new Role(null,"ROLE_ADMIN"));
			userService.saveRole(new Role(null,"ROLE_SUPER_ADMIN"));

			userService.saveUser(new User(null,"Jesus","estavoltando@amor.com","creia",new ArrayList<>()));
			userService.saveUser(new User(null,"Scherlandro","scherlandro@gmail.com","321",new ArrayList<>()));
			userService.saveUser(new User(null,"Lailton","lailton@gmail.com","123",new ArrayList<>()));
			userService.saveUser(new User(null,"Toquinho","toquinho@gmail.com","123",new ArrayList<>()));

			userService.addRoleToUser("estavoltando@amor.com","ROLE_SUPER_ADMIN");
			userService.addRoleToUser("scherlandro@gmail.com","ROLE_ADMIN");
			userService.addRoleToUser("lailton@gmail.com","ROLE_MANAGER");
			userService.addRoleToUser("toquinho@gmail.com","ROLE_USER");
		};
	}
*/

}
