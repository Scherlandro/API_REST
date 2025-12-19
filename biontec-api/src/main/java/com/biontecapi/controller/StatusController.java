package com.biontecapi.controller;

import com.biontecapi.serviceImpl.OrdemDeServicoServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatusController {
   // private static Logger LOGGER = LoggerFactory.getLogger(StatusController.class);

    @GetMapping(path = "/api/status")
    public String check(){
     //   LOGGER.info("Status ok!" );
        return "ONLINE 4";
    }
}
