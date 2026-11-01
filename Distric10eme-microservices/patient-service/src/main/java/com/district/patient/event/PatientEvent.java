package com.district.patient.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

/**
 * Evenement Kafka publie par le patient-service.
 * Serialise en JSON avant envoi sur le topic Kafka.
 */
public class PatientEvent {

    private Long patientId;
    private String numeroDossier;
    private String nom;
    private String prenom;
    private String telephone;
    private String email;
    private String action; // CREATED | UPDATED | DELETED

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    public PatientEvent() {}

    public PatientEvent(Long patientId, String numeroDossier, String nom, String prenom,
                        String telephone, String email, String action) {
        this.patientId = patientId;
        this.numeroDossier = numeroDossier;
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.email = email;
        this.action = action;
        this.timestamp = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getNumeroDossier() { return numeroDossier; }
    public void setNumeroDossier(String numeroDossier) { this.numeroDossier = numeroDossier; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    @Override
    public String toString() {
        return "PatientEvent{patientId=" + patientId + ", nom='" + nom + "', action='" + action + "', timestamp=" + timestamp + "}";
    }
}
