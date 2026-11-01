package com.district.patient.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

/**
 * Configuration de creation automatique des topics Kafka au demarrage.
 * Chaque topic est cree avec 1 partition et 1 replique (env. developpement).
 */
@Configuration
public class KafkaTopicConfig {

    // Topics publies par patient-service
    @Bean
    public NewTopic patientCreatedTopic() {
        return TopicBuilder.name("patient.created")
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic patientUpdatedTopic() {
        return TopicBuilder.name("patient.updated")
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic patientDeletedTopic() {
        return TopicBuilder.name("patient.deleted")
                .partitions(1)
                .replicas(1)
                .build();
    }
}
