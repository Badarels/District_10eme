package com.district.notification.kafka;

import com.district.notification.entity.Notification;
import com.district.notification.entity.StatutNotification;
import com.district.notification.repository.NotificationRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Consumer Kafka central du SIH District 10eme.
 * Reçoit les événements de tous les microservices et génère des notifications automatiques.
 */
@Service
public class KafkaConsumerService {

    private static final Logger log = LoggerFactory.getLogger(KafkaConsumerService.class);

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Écoute les événements du cycle de vie des Patients
     */
    @KafkaListener(topics = {"patient.created", "patient.updated", "patient.deleted"}, groupId = "notification-group")
    public void handlePatientEvent(String message) {
        log.info("Kafka Consumer: Message reçu sur topic patient.* -> {}", message);
        try {
            JsonNode node = objectMapper.readTree(message);
            Long patientId = node.has("patientId") && !node.get("patientId").isNull() ? node.get("patientId").asLong() : 0L;
            String nom = node.has("nom") ? node.get("nom").asText("") : "";
            String prenom = node.has("prenom") ? node.get("prenom").asText("") : "";
            String action = node.has("action") ? node.get("action").asText("CREATED") : "CREATED";
            String numeroDossier = node.has("numeroDossier") ? node.get("numeroDossier").asText("") : "";

            String notificationMessage;
            if ("CREATED".equalsIgnoreCase(action)) {
                notificationMessage = String.format("Bienvenue %s %s ! Votre dossier médical N° %s a été créé avec succès au District 10ème.",
                        prenom, nom, numeroDossier);
            } else if ("UPDATED".equalsIgnoreCase(action)) {
                notificationMessage = String.format("Mise à jour: Les informations du dossier %s (%s %s) ont été modifiées.",
                        numeroDossier, prenom, nom);
            } else {
                notificationMessage = String.format("Alerte: Le dossier médical de %s %s (ID: %d) a été archivé/supprimé.",
                        prenom, nom, patientId);
            }

            createNotification(patientId, "EMAIL", notificationMessage);
        } catch (Exception e) {
            log.error("Erreur lors du traitement de l'événement Patient: {}", e.getMessage(), e);
        }
    }

    /**
     * Écoute les événements de Rendez-vous
     */
    @KafkaListener(topics = {"rendezvous.created", "rendezvous.confirmed", "rendezvous.cancelled"}, groupId = "notification-group")
    public void handleRendezVousEvent(String message) {
        log.info("Kafka Consumer: Message reçu sur topic rendezvous.* -> {}", message);
        try {
            JsonNode node = objectMapper.readTree(message);
            Long patientId = node.has("patientId") && !node.get("patientId").isNull() ? node.get("patientId").asLong() : 0L;
            Long medecinId = node.has("medecinId") && !node.get("medecinId").isNull() ? node.get("medecinId").asLong() : 0L;
            String dateRdv = node.has("dateRendezVous") ? node.get("dateRendezVous").asText("") : "";
            String statut = node.has("statut") ? node.get("statut").asText("") : "";
            String action = node.has("action") ? node.get("action").asText("") : "";

            String notificationMessage = String.format("Rendez-vous [%s]: Votre RDV avec le Dr (ID: %d) prévu le %s est actuellement: %s.",
                    action, medecinId, dateRdv, statut);

            createNotification(patientId, "EMAIL", notificationMessage);
        } catch (Exception e) {
            log.error("Erreur lors du traitement de l'événement Rendez-vous: {}", e.getMessage(), e);
        }
    }

    /**
     * Écoute les événements de Consultation
     */
    @KafkaListener(topics = {"consultation.created"}, groupId = "notification-group")
    public void handleConsultationEvent(String message) {
        log.info("Kafka Consumer: Message reçu sur topic consultation.created -> {}", message);
        try {
            JsonNode node = objectMapper.readTree(message);
            Long patientId = node.has("patientId") && !node.get("patientId").isNull() ? node.get("patientId").asLong() : 0L;
            Long consultationId = node.has("consultationId") && !node.get("consultationId").isNull() ? node.get("consultationId").asLong() : 0L;
            String diagnostic = node.has("diagnostic") ? node.get("diagnostic").asText("") : "Non précisé";

            String notificationMessage = String.format("Consultation terminée (Réf #%d): Un compte-rendu médical a été ajouté à votre dossier (Diagnostic: %s).",
                    consultationId, diagnostic);

            createNotification(patientId, "EMAIL", notificationMessage);
        } catch (Exception e) {
            log.error("Erreur lors du traitement de l'événement Consultation: {}", e.getMessage(), e);
        }
    }

    /**
     * Écoute les événements d'Hospitalisation
     */
    @KafkaListener(topics = {"hospitalisation.cree"}, groupId = "notification-group")
    public void handleHospitalisationEvent(String message) {
        log.info("Kafka Consumer: Message reçu sur topic hospitalisation.cree -> {}", message);
        try {
            JsonNode node = objectMapper.readTree(message);
            Long patientId = node.has("patientId") && !node.get("patientId").isNull() ? node.get("patientId").asLong() : 0L;
            String chambre = node.has("chambre") ? node.get("chambre").asText("") : "Non assignée";
            String lit = node.has("lit") ? node.get("lit").asText("") : "";

            String notificationMessage = String.format("Avis d'admission: Le patient a été admis en hospitalisation (Chambre: %s, Lit: %s).",
                    chambre, lit);

            createNotification(patientId, "EMAIL", notificationMessage);
        } catch (Exception e) {
            log.error("Erreur lors du traitement de l'événement Hospitalisation: {}", e.getMessage(), e);
        }
    }

    private void createNotification(Long destinataireId, String canal, String message) {
        Notification notification = new Notification();
        notification.setDestinataireId(destinataireId != null ? destinataireId : 0L);
        notification.setCanal(canal);
        notification.setMessage(message);
        notification.setDateEnvoi(LocalDateTime.now());
        notification.setStatut(StatutNotification.EN_ATTENTE);
        notificationRepository.save(notification);
        log.info("Notification persistée en base pour destinataireId {}: {}", destinataireId, message);
    }
}
