package com.district.patient.controller;

import com.district.patient.service.KafkaProducerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestKafkaController {

    private final KafkaProducerService producerService;

    public TestKafkaController(KafkaProducerService producerService) {
        this.producerService = producerService;
    }

    // Exemple d'appel : http://localhost:8082/api/v1/send?msg=BonjourKafka
    @GetMapping("/api/v1/send")
    public ResponseEntity<String> sendToKafka(@RequestParam("msg") String message) {
        String topicName = "mon-premier-topic";
        producerService.sendMessage(topicName, message);
        return ResponseEntity.ok("Message envoyé avec succès au topic Kafka !");
    }
}
