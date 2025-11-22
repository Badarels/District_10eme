package com.district.hospitalisation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class HospitalisationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(HospitalisationServiceApplication.class, args);
    }
}

