package com.district.consultation.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

/**
 * Evenement Kafka publie par le consultation-service.
 * Contient les informations essentielles d'une consultation creee.
 */
public class ConsultationEvent {

    private Long consultationId;
    private Long patientId;
    private Long medecinId;
    private String motif;
    private String action; // CREATED | UPDATED | DELETED

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    public ConsultationEvent() {}

    public ConsultationEvent(Long consultationId, Long patientId, Long medecinId,
                             String motif, String action) {
        this.consultationId = consultationId;
        this.patientId = patientId;
        this.medecinId = medecinId;
        this.motif = motif;
        this.action = action;
        this.timestamp = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getConsultationId() { return consultationId; }
    public void setConsultationId(Long consultationId) { this.consultationId = consultationId; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Long getMedecinId() { return medecinId; }
    public void setMedecinId(Long medecinId) { this.medecinId = medecinId; }

    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
