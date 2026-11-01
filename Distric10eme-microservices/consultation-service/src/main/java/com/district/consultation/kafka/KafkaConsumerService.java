package com.district.consultation.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

/**
 * Consumer Kafka du consultation-service.
 * Ecoute les evenements patient.created pour etre informé des nouveaux patients
 * et pouvoir enrichir les consultations avec les donnees patient.
 */
@Service
public class KafkaConsumerService {

    private static final Logger log = LoggerFactory.getLogger(KafkaConsumerService.class);

    /**
     * Ecoute les nouveaux patients crees par le patient-service.
     * Peut etre utilise pour mettre a jour un cache local ou logger les nouveaux patients.
     *
     * @param message JSON du PatientEvent recu
     */
    @KafkaListener(topics = "patient.created", groupId = "consultation-group")
    public void onPatientCreated(String message) {
        log.info("[Kafka Consumer] Nouveau patient recu: {}", message);
        // Ici on peut parser le JSON et mettre a jour un cache interne si besoin
        // ObjectMapper mapper = new ObjectMapper();
        // PatientEvent event = mapper.readValue(message, PatientEvent.class);
    }

    /**
     * Ecoute les mises a jour de patients.
     *
     * @param message JSON du PatientEvent recu
     */
    @KafkaListener(topics = "patient.updated", groupId = "consultation-group")
    public void onPatientUpdated(String message) {
        log.info("[Kafka Consumer] Patient mis a jour: {}", message);
    }
}
