package com.district.rendezvous;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class RendezVousServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(RendezVousServiceApplication.class, args);
    }
}

