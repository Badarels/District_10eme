package com.district.hospitalisation.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

/**
 * Evenement Kafka publie par hospitalisation-service lors d'une admission/sortie.
 */
public class HospitalisationEvent {

    private Long hospitalisationId;
    private Long patientId;
    private Long medecinId;
    private Long litId;
    private String motifAdmission;
    private String action; // CREATED | UPDATED | DISCHARGED

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    public HospitalisationEvent() {}

    public HospitalisationEvent(Long hospitalisationId, Long patientId, Long medecinId,
                                Long litId, String motifAdmission, String action) {
        this.hospitalisationId = hospitalisationId;
        this.patientId = patientId;
        this.medecinId = medecinId;
        this.litId = litId;
        this.motifAdmission = motifAdmission;
        this.action = action;
        this.timestamp = LocalDateTime.now();
    }

    public Long getHospitalisationId() { return hospitalisationId; }
    public void setHospitalisationId(Long hospitalisationId) { this.hospitalisationId = hospitalisationId; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Long getMedecinId() { return medecinId; }
    public void setMedecinId(Long medecinId) { this.medecinId = medecinId; }

    public Long getLitId() { return litId; }
    public void setLitId(Long litId) { this.litId = litId; }

    public String getMotifAdmission() { return motifAdmission; }
    public void setMotifAdmission(String motifAdmission) { this.motifAdmission = motifAdmission; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
