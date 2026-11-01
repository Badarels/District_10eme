package com.district.hospitalisation.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

/**
 * Service pour la publication d'evenements Kafka depuis hospitalisation-service.
 */
@Service
public class KafkaProducerService {

    private static final Logger log = LoggerFactory.getLogger(KafkaProducerService.class);

    private final KafkaTemplate<String, String> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(String topic, String key, String message) {
        log.info("Publication Kafka -> topic: {}, key: {}, payload: {}", topic, key, message);
        kafkaTemplate.send(topic, key, message).whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Echec d'envoi Kafka [topic={}]: {}", topic, ex.getMessage());
            } else {
                log.info("Message livre avec succes [topic={}, partition={}, offset={}]",
                        topic,
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            }
        });
    }

    public void sendMessage(String topic, String message) {
        sendMessage(topic, null, message);
    }
}
