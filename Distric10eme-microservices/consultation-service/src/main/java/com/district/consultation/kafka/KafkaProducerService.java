package com.district.consultation.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

/**
 * Service generique pour publier des messages JSON sur les topics Kafka.
 * Utilise par ConsultationService pour publier les evenements metier.
 */
@Service
public class KafkaProducerService {

    private static final Logger log = LoggerFactory.getLogger(KafkaProducerService.class);

    private final KafkaTemplate<String, String> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(String topic, String message) {
        log.info("[Kafka Producer] Envoi sur topic '{}': {}", topic, message);
        kafkaTemplate.send(topic, message);
    }
}
